import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: 'P1' | 'P2' | 'P3' | null;
  section: string;
  starred: boolean;
}

interface WorkspaceInfo {
  path: string;
  todosPath: string;
  documentsPath: string;
  contextPath: string;
}

export class WorkspaceService {
  private workspacePath: string;

  constructor() {
    this.workspacePath = process.env.WORKSPACE_PATH || '/Users/nuver/Desktop/cadence-os';
  }

  async getWorkspaceInfo(): Promise<WorkspaceInfo> {
    return {
      path: this.workspacePath,
      todosPath: path.join(this.workspacePath, 'to_do\'s'),
      documentsPath: path.join(this.workspacePath, 'documents'),
      contextPath: path.join(this.workspacePath, 'context'),
    };
  }

  async getTasks(): Promise<{ raw: string; parsed: Task[] }> {
    const filePath = path.join(this.workspacePath, 'to_do\'s', 'tasks.md');
    const content = await fs.readFile(filePath, 'utf-8');
    const parsed = this.parseTasksMarkdown(content);
    return { raw: content, parsed };
  }

  async getBacklog(): Promise<{ raw: string; parsed: Task[] }> {
    const filePath = path.join(this.workspacePath, 'to_do\'s', 'backlog.md');
    const content = await fs.readFile(filePath, 'utf-8');
    const parsed = this.parseTasksMarkdown(content);
    return { raw: content, parsed };
  }

  async getProgressLog(): Promise<{ raw: string }> {
    const filePath = path.join(this.workspacePath, 'to_do\'s', 'progress-log.md');
    const content = await fs.readFile(filePath, 'utf-8');
    return { raw: content };
  }

  async getScratchpad(): Promise<string> {
    const filePath = path.join(this.workspacePath, 'to_do\'s', 'scratchpad.md');
    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch {
      return '';
    }
  }

  async saveScratchpad(content: string): Promise<void> {
    const filePath = path.join(this.workspacePath, 'to_do\'s', 'scratchpad.md');
    await fs.writeFile(filePath, content, 'utf-8');
  }

  private parseTasksMarkdown(content: string): Task[] {
    const tasks: Task[] = [];
    const lines = content.split('\n');
    let currentSection = 'default';
    let taskId = 0;

    for (const line of lines) {
      // Detect section headers
      if (line.startsWith('## ')) {
        currentSection = line.replace('## ', '').trim();
        continue;
      }

      // Parse task lines - supports starred format: - [ ] ★ Task text
      const taskMatch = line.match(/^- \[([ x])\] (.+)$/);
      if (taskMatch) {
        const completed = taskMatch[1] === 'x';
        let text = taskMatch[2];
        
        // Check if task is starred (★ at the beginning)
        const starred = text.startsWith('★ ') || text.startsWith('⭐ ');
        if (starred) {
          text = text.replace(/^[★⭐]\s*/, '');
        }
        
        // Detect priority from section name
        let priority: 'P1' | 'P2' | 'P3' | null = null;
        if (currentSection.includes('P1') || currentSection.includes('Alta')) {
          priority = 'P1';
        } else if (currentSection.includes('P2') || currentSection.includes('Média')) {
          priority = 'P2';
        } else if (currentSection.includes('P3') || currentSection.includes('Baixa')) {
          priority = 'P3';
        }

        const cdIdMatch = text.match(/\(\^cd-\d{8}-\d{3}\)/);
        const stableId = cdIdMatch ? cdIdMatch[0].slice(1, -1) : `task-${taskId}`;

        tasks.push({
          id: stableId,
          text,
          completed,
          priority,
          section: currentSection,
          starred,
        });
        taskId++;
      }
    }

    return tasks;
  }

  // ============ COMMITMENTS METHODS ============

  async getCommitments(): Promise<CommitmentData> {
    const filePath = path.join(this.workspacePath, 'to_do\'s', 'commitments.md');
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return this.parseCommitmentsMarkdown(content);
    } catch {
      return { iOwe: [], othersOweMe: [], completed: [] };
    }
  }

  private parseCommitmentsMarkdown(content: string): CommitmentData {
    const iOwe: Commitment[] = [];
    const othersOweMe: Commitment[] = [];
    const completed: Commitment[] = [];

    let currentSection = '';
    const lines = content.split('\n');

    for (const line of lines) {
      if (line.startsWith('## ')) {
        const section = line.replace('## ', '').trim().toLowerCase();
        if (section.includes('i owe') || section.includes('eu devo')) {
          currentSection = 'iOwe';
        } else if (section.includes('others owe') || section.includes('me devem')) {
          currentSection = 'othersOweMe';
        } else if (section.includes('completed') || section.includes('conclu')) {
          currentSection = 'completed';
        }
        continue;
      }

      const taskMatch = line.match(/^- \[([ x])\] (.+)$/);
      if (!taskMatch) continue;

      const isCompleted = taskMatch[1] === 'x';
      const text = taskMatch[2];

      const whatMatch = text.match(/^(.+?)\s*->\s*(to|from)\s+(.+?)\s*->\s*since\s+(\d{4}-\d{2}-\d{2})/);
      const idMatch = text.match(/\((\^cd-\d{8}-\d{3})\)/);
      const contextMatch = text.match(/context:\s*([^(]+)/);

      const commitment: Commitment = {
        what: whatMatch ? whatMatch[1].trim() : text,
        who: whatMatch ? whatMatch[3].split('->')[0].trim() : '',
        since: whatMatch ? whatMatch[4] : '',
        context: contextMatch ? contextMatch[1].trim() : '',
        taskId: idMatch ? idMatch[1] : undefined,
        completed: isCompleted,
        daysOld: 0,
      };

      if (commitment.since) {
        const sinceDate = new Date(commitment.since);
        const today = new Date();
        commitment.daysOld = Math.floor((today.getTime() - sinceDate.getTime()) / (1000 * 60 * 60 * 24));
      }

      if (currentSection === 'iOwe') iOwe.push(commitment);
      else if (currentSection === 'othersOweMe') othersOweMe.push(commitment);
      else if (currentSection === 'completed') completed.push(commitment);
    }

    return { iOwe, othersOweMe, completed };
  }

  // ============ INITIATIVES METHODS ============

  async getInitiatives(): Promise<InitiativeData> {
    const filePath = path.join(this.workspacePath, 'cadence-progress.json');
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content);
      const initiatives: Initiative[] = [];

      for (const [key, value] of Object.entries(data.initiatives || {})) {
        const init = value as Record<string, unknown>;
        const lastUpdated = (data.metadata?.last_updated as string) || '';
        const daysSinceUpdate = lastUpdated
          ? Math.floor((Date.now() - new Date(lastUpdated).getTime()) / (1000 * 60 * 60 * 24))
          : 0;

        initiatives.push({
          id: key,
          name: (init.name as string) || key,
          status: (init.status as string) || 'unknown',
          priority: (init.priority as string) || 'P2',
          quarter: (init.quarter as string) || '',
          currentPhase: (init.current_phase as string) || '',
          completedPhases: (init.completed_phases as string[]) || [],
          documents: ((init.documents as Array<Record<string, string>>) || []).map(d => ({
            type: d.type || '',
            path: d.path || '',
            status: d.status || '',
            date: d.date || '',
          })),
          nextActions: (init.next_actions as string[]) || [],
          blockers: (init.blockers as string[]) || [],
          daysSinceUpdate,
          isStale: daysSinceUpdate > 7,
        });
      }

      return {
        initiatives,
        lastUpdated: data.metadata?.last_updated || '',
      };
    } catch {
      return { initiatives: [], lastUpdated: '' };
    }
  }

  // ============ PEOPLE METHODS ============

  async getPeople(): Promise<PersonSummary[]> {
    const peoplePath = path.join(this.workspacePath, 'context', 'people');
    const people: PersonSummary[] = [];

    try {
      const files = await fs.readdir(peoplePath);
      const mdFiles = files.filter(f => f.endsWith('.md') && !f.startsWith('_'));

      for (const file of mdFiles) {
        const filePath = path.join(peoplePath, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const person = this.parsePersonPage(content, file);
        if (person) people.push(person);
      }
    } catch {
      // Directory doesn't exist or can't be read
    }

    return people;
  }

  private parsePersonPage(content: string, filename: string): PersonSummary | null {
    const nameMatch = content.match(/^# (.+)$/m);
    const name = nameMatch ? nameMatch[1].trim() : filename.replace('.md', '').replace(/-/g, ' ');

    const roleMatch = content.match(/\*\*Role\*\*\s*\|\s*(.+)/);
    const companyMatch = content.match(/\*\*Company\*\*\s*\|\s*(.+)/);
    const relationshipMatch = content.match(/\*\*Relationship\*\*\s*\|\s*(.+)/);

    const meetingDates: string[] = [];
    const meetingTableRegex = /\|\s*(\d{4}-\d{2}-\d{2})\s*\|/g;
    let dateMatch;
    while ((dateMatch = meetingTableRegex.exec(content)) !== null) {
      meetingDates.push(dateMatch[1]);
    }
    meetingDates.sort().reverse();

    let openItemsCount = 0;
    const openItemsSection = content.match(/## Open Items[\s\S]*?(?=\n## |$)/);
    if (openItemsSection) {
      const itemMatches = openItemsSection[0].match(/^- (?!<!--)/gm);
      if (itemMatches) openItemsCount = itemMatches.length;
    }

    return {
      name,
      filename,
      role: roleMatch ? roleMatch[1].trim().replace(/<!--.*?-->/, '').trim() : '',
      company: companyMatch ? companyMatch[1].trim().replace(/<!--.*?-->/, '').trim() : '',
      relationship: relationshipMatch ? relationshipMatch[1].trim().replace(/<!--.*?-->/, '').trim() : '',
      lastInteraction: meetingDates[0] || '',
      openItemsCount,
      meetingCount: meetingDates.length,
    };
  }

  async getContext(): Promise<string> {
    // Read relevant context files for the AI
    const contextFiles = [
      'context/USERS.md',
      'global-context/DOMAIN-VISION.md',
      'global-context/ROADMAP.md',
    ];

    let context = '';
    for (const file of contextFiles) {
      try {
        const filePath = path.join(this.workspacePath, file);
        const content = await fs.readFile(filePath, 'utf-8');
        context += `\n\n--- ${file} ---\n${content}`;
      } catch {
        // File not found, skip
      }
    }

    return context;
  }

  async addTask(params: { text: string; priority?: string; section?: string }): Promise<Task> {
    const filePath = path.join(this.workspacePath, 'to_do\'s', 'tasks.md');
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split('\n');

    // Determine target section
    const priority = params.priority || 'P2';
    let targetSection = params.section;
    
    if (!targetSection) {
      if (priority === 'P1') {
        targetSection = 'Hoje - P1 (Alta Prioridade)';
      } else if (priority === 'P2') {
        targetSection = 'Hoje - P2 (Média Prioridade)';
      } else {
        targetSection = 'Hoje - P2 (Média Prioridade)';
      }
    }

    // Find the section and insert the task
    let insertIndex = -1;
    let foundSection = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if this is our target section
      if (line.startsWith('## ') && line.includes(targetSection.replace('## ', ''))) {
        foundSection = true;
        continue;
      }
      
      // If we found the section, find the end of it (next section or ---)
      if (foundSection) {
        if (line.startsWith('## ') || line.startsWith('---')) {
          insertIndex = i;
          break;
        }
      }
    }

    // If section not found, append at the end
    if (insertIndex === -1) {
      insertIndex = lines.length;
    }

    // Insert the new task before the section break
    const newTask = `- [ ] ${params.text}`;
    
    // Find the last task line in the section, or after the section header
    let actualInsertIndex = insertIndex;
    for (let i = insertIndex - 1; i >= 0; i--) {
      const line = lines[i].trim();
      if (line.startsWith('- [')) {
        actualInsertIndex = i + 1;
        break;
      }
      if (line.startsWith('## ')) {
        actualInsertIndex = i + 2; // After section header and empty line
        break;
      }
    }

    lines.splice(actualInsertIndex, 0, newTask);
    
    await fs.writeFile(filePath, lines.join('\n'), 'utf-8');

    const taskId = `task-${Date.now()}`;
    return {
      id: taskId,
      text: params.text,
      completed: false,
      priority: priority as 'P1' | 'P2' | 'P3',
      section: targetSection,
      starred: false,
    };
  }

  async updateTask(taskId: string, updates: { completed?: boolean; text?: string; starred?: boolean }): Promise<boolean> {
    const filePath = path.join(this.workspacePath, 'to_do\'s', 'tasks.md');
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split('\n');

    const isCdId = taskId.startsWith('^cd-');
    const taskIndex = isCdId ? -1 : parseInt(taskId.replace('task-', ''));
    let currentTaskIndex = 0;
    let found = false;
    let taskLineIndex = -1;
    let currentSection = '';
    let taskText = '';
    let isCurrentlyStarred = false;
    let wasCompleted = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.startsWith('## ')) {
        currentSection = line.replace('## ', '').trim();
        continue;
      }
      
      const taskMatch = line.match(/^- \[([ x])\] (.+)$/);
      
      if (taskMatch) {
        const matchById = isCdId
          ? line.includes(`(${taskId})`)
          : currentTaskIndex === taskIndex;

        if (matchById) {
          taskLineIndex = i;
          wasCompleted = taskMatch[1] === 'x';
          taskText = taskMatch[2];
          isCurrentlyStarred = taskText.startsWith('★ ') || taskText.startsWith('⭐ ');
          
          if (isCurrentlyStarred) {
            taskText = taskText.replace(/^[★⭐]\s*/, '');
          }
          
          found = true;
          break;
        }
        currentTaskIndex++;
      }
    }

    if (!found) {
      return false;
    }

    // Apply text update if provided
    if (updates.text) {
      taskText = updates.text;
    }

    // Apply star update
    let shouldStar = isCurrentlyStarred;
    if (updates.starred !== undefined) {
      shouldStar = updates.starred;
    }

    // Determine new completion state
    const willBeCompleted = updates.completed !== undefined ? updates.completed : wasCompleted;

    // Build the new task line
    const checkbox = willBeCompleted ? '[x]' : '[ ]';
    const starPrefix = shouldStar ? '★ ' : '';
    const newTaskLine = `- ${checkbox} ${starPrefix}${taskText}`;

    // If completion state is changing, we need to move the task
    if (updates.completed !== undefined && updates.completed !== wasCompleted) {
      // Remove the task from its current position
      lines.splice(taskLineIndex, 1);

      if (updates.completed) {
        // Moving to "Concluídas Hoje" section
        const targetSection = 'Concluídas Hoje';
        const insertIndex = this.findSectionInsertIndex(lines, targetSection);
        lines.splice(insertIndex, 0, newTaskLine);
      } else {
        // Moving back from "Concluídas Hoje" to appropriate section
        // Determine target section based on priority in task text or default to P2
        let targetSection = 'Hoje - P2 (Média Prioridade)';
        
        // Check if task text contains priority hint or use default
        if (taskText.includes('P1') || taskText.includes('URGENT')) {
          targetSection = 'Hoje - P1 (Alta Prioridade)';
        } else if (taskText.includes('P3')) {
          targetSection = 'Hoje - P2 (Média Prioridade)'; // Default to P2
        }
        
        const insertIndex = this.findSectionInsertIndex(lines, targetSection);
        lines.splice(insertIndex, 0, newTaskLine);
      }
    } else {
      // Just update the task in place
      lines[taskLineIndex] = newTaskLine;
    }

    await fs.writeFile(filePath, lines.join('\n'), 'utf-8');
    return true;
  }

  private findSectionInsertIndex(lines: string[], targetSection: string): number {
    let inTargetSection = false;
    let lastTaskLineInSection = -1;
    let sectionHeaderIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.startsWith('## ')) {
        const section = line.replace('## ', '').trim();
        if (section === targetSection || section.includes(targetSection.replace('## ', ''))) {
          inTargetSection = true;
          sectionHeaderIndex = i;
          continue;
        } else if (inTargetSection) {
          // We've left the target section
          break;
        }
      }
      
      if (line.startsWith('---') && inTargetSection) {
        // End of section
        break;
      }
      
      if (inTargetSection && line.match(/^- \[([ x])\] /)) {
        lastTaskLineInSection = i;
      }
    }

    // Insert after the last task in the section, or after the header if no tasks
    if (lastTaskLineInSection !== -1) {
      return lastTaskLineInSection + 1;
    } else if (sectionHeaderIndex !== -1) {
      // Insert after the section header (and any empty line)
      let insertIndex = sectionHeaderIndex + 1;
      while (insertIndex < lines.length && lines[insertIndex].trim() === '') {
        insertIndex++;
      }
      // If next line is placeholder text like "*Nenhuma tarefa*", insert before it
      if (insertIndex < lines.length && lines[insertIndex].startsWith('*')) {
        return insertIndex;
      }
      return insertIndex;
    }
    
    // Section not found, append at end
    return lines.length;
  }

  async toggleTaskStar(taskId: string): Promise<boolean> {
    const filePath = path.join(this.workspacePath, 'to_do\'s', 'tasks.md');
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split('\n');

    const isCdId = taskId.startsWith('^cd-');
    const taskIndex = isCdId ? -1 : parseInt(taskId.replace('task-', ''));
    let currentTaskIndex = 0;
    let found = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const taskMatch = line.match(/^- \[([ x])\] (.+)$/);
      
      if (taskMatch) {
        const matchById = isCdId
          ? line.includes(`(${taskId})`)
          : currentTaskIndex === taskIndex;
        if (matchById) {
          let text = taskMatch[2];
          const isCurrentlyStarred = text.startsWith('★ ') || text.startsWith('⭐ ');
          
          if (isCurrentlyStarred) {
            // Remove star
            text = text.replace(/^[★⭐]\s*/, '');
          } else {
            // Add star
            text = '★ ' + text;
          }
          
          const checkbox = taskMatch[1] === 'x' ? '[x]' : '[ ]';
          lines[i] = `- ${checkbox} ${text}`;
          found = true;
          break;
        }
        currentTaskIndex++;
      }
    }

    if (found) {
      await fs.writeFile(filePath, lines.join('\n'), 'utf-8');
    }

    return found;
  }

  async addToBacklog(params: { text: string; section?: string }): Promise<Task> {
    const filePath = path.join(this.workspacePath, 'to_do\'s', 'backlog.md');
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split('\n');

    const section = params.section || 'Ideias e Futuros';
    
    // Find the section or append at the end
    let insertIndex = lines.length;
    let foundSection = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.startsWith('## ') && line.includes(section.replace('## ', ''))) {
        foundSection = true;
        continue;
      }
      
      if (foundSection) {
        if (line.startsWith('## ') || line.startsWith('---')) {
          insertIndex = i;
          break;
        }
      }
    }

    // Find the right place to insert (after last task in section)
    let actualInsertIndex = insertIndex;
    for (let i = insertIndex - 1; i >= 0; i--) {
      const line = lines[i].trim();
      if (line.startsWith('- [')) {
        actualInsertIndex = i + 1;
        break;
      }
      if (line.startsWith('## ')) {
        actualInsertIndex = i + 2;
        break;
      }
    }

    const newTask = `- [ ] ${params.text}`;
    lines.splice(actualInsertIndex, 0, newTask);
    
    await fs.writeFile(filePath, lines.join('\n'), 'utf-8');

    const taskId = `backlog-${Date.now()}`;
    return {
      id: taskId,
      text: params.text,
      completed: false,
      priority: null,
      section,
      starred: false,
    };
  }

  async promoteFromBacklog(backlogTaskId: string): Promise<Task | null> {
    const backlogPath = path.join(this.workspacePath, 'to_do\'s', 'backlog.md');
    const backlogContent = await fs.readFile(backlogPath, 'utf-8');
    const backlogLines = backlogContent.split('\n');

    // Find and remove the task from backlog
    const taskIndex = parseInt(backlogTaskId.replace('task-', ''));
    let currentTaskIndex = 0;
    let taskText = '';
    let removedLineIndex = -1;

    for (let i = 0; i < backlogLines.length; i++) {
      const line = backlogLines[i];
      const taskMatch = line.match(/^- \[([ x])\] (.+)$/);
      
      if (taskMatch) {
        if (currentTaskIndex === taskIndex) {
          taskText = taskMatch[2];
          removedLineIndex = i;
          break;
        }
        currentTaskIndex++;
      }
    }

    if (removedLineIndex === -1) {
      return null;
    }

    // Remove from backlog
    backlogLines.splice(removedLineIndex, 1);
    await fs.writeFile(backlogPath, backlogLines.join('\n'), 'utf-8');

    // Add to tasks
    return await this.addTask({ text: taskText, priority: 'P2' });
  }

  // ============ NOTES METHODS ============

  async getNotes(): Promise<string> {
    const filePath = path.join(this.workspacePath, 'to_do\'s', 'notes.md');
    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch {
      return '';
    }
  }

  async saveNotes(content: string): Promise<void> {
    const filePath = path.join(this.workspacePath, 'to_do\'s', 'notes.md');
    await fs.writeFile(filePath, content, 'utf-8');
  }

  async getNotesForTask(taskId: string): Promise<string[]> {
    const content = await this.getNotes();
    const lines = content.split('\n');
    const notes: string[] = [];
    let inTaskSection = false;

    for (const line of lines) {
      // Check if we're entering a task section
      if (line.startsWith('### ')) {
        inTaskSection = line.includes(taskId);
        continue;
      }

      // If in the task section, collect notes
      if (inTaskSection) {
        if (line.startsWith('## ') || line.startsWith('---')) {
          break; // End of task section
        }
        if (line.startsWith('- ') && line.length > 2) {
          notes.push(line.substring(2));
        }
      }
    }

    return notes;
  }

  async addNoteToTask(taskId: string, taskText: string, note: string): Promise<void> {
    const filePath = path.join(this.workspacePath, 'to_do\'s', 'notes.md');
    let content = await this.getNotes();
    
    const today = new Date().toISOString().split('T')[0];
    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const taskHeader = `### ${taskId}: ${taskText.substring(0, 50)}${taskText.length > 50 ? '...' : ''}`;
    const noteEntry = `- ${time} - ${note}`;

    // Check if today's section exists
    if (!content.includes(`## ${today}`)) {
      // Add today's section after the header
      const headerEnd = content.indexOf('---');
      if (headerEnd !== -1) {
        content = content.substring(0, headerEnd + 3) + `\n\n## ${today}\n` + content.substring(headerEnd + 3);
      } else {
        content += `\n\n## ${today}\n`;
      }
    }

    // Check if task section exists for today
    const todaySection = content.indexOf(`## ${today}`);
    const nextSection = content.indexOf('\n## ', todaySection + 1);
    const todayContent = nextSection !== -1 
      ? content.substring(todaySection, nextSection)
      : content.substring(todaySection);

    if (todayContent.includes(taskHeader)) {
      // Add note to existing task section
      const taskHeaderIndex = content.indexOf(taskHeader, todaySection);
      const nextTaskOrSection = content.indexOf('\n### ', taskHeaderIndex + 1);
      const nextDateSection = content.indexOf('\n## ', taskHeaderIndex + 1);
      
      let insertPoint: number;
      if (nextTaskOrSection !== -1 && (nextDateSection === -1 || nextTaskOrSection < nextDateSection)) {
        insertPoint = nextTaskOrSection;
      } else if (nextDateSection !== -1) {
        insertPoint = nextDateSection;
      } else {
        insertPoint = content.length;
      }

      content = content.substring(0, insertPoint) + noteEntry + '\n' + content.substring(insertPoint);
    } else {
      // Create new task section
      const insertPoint = content.indexOf('\n', todaySection + `## ${today}`.length);
      const newSection = `\n${taskHeader}\n${noteEntry}\n`;
      content = content.substring(0, insertPoint + 1) + newSection + content.substring(insertPoint + 1);
    }

    await fs.writeFile(filePath, content, 'utf-8');
  }

  // ============ BRIEFING METHODS ============

  async getLatestBriefing(): Promise<BriefingData | null> {
    const briefingsPath = path.join(this.workspacePath, 'to_do\'s', 'briefings');
    
    try {
      const files = await fs.readdir(briefingsPath);
      const mdFiles = files
        .filter(f => f.endsWith('.md') && !f.startsWith('.'))
        .sort()
        .reverse();

      if (mdFiles.length === 0) {
        return null;
      }

      const latestFile = mdFiles[0];
      return await this.getBriefingByDate(latestFile.replace('.md', ''));
    } catch {
      return null;
    }
  }

  async getBriefingByDate(date: string): Promise<BriefingData | null> {
    const filePath = path.join(this.workspacePath, 'to_do\'s', 'briefings', `${date}.md`);
    
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return this.parseBriefingMarkdown(content, date);
    } catch {
      return null;
    }
  }

  private parseBriefingMarkdown(content: string, date: string): BriefingData {
    const { data: frontmatter, content: body } = matter(content);
    
    // Parse stats from frontmatter
    const stats: BriefingStats = {
      meetings: frontmatter.stats?.meetings || 0,
      actionItems: frontmatter.stats?.actionItems || 0,
      blockers: frontmatter.stats?.blockers || 0,
      jiraInProgress: frontmatter.stats?.jiraInProgress || 0,
      jiraPending: frontmatter.stats?.jiraPending || 0,
    };

    // Parse Day Overview section (narrative text)
    let dayOverview = '';
    const dayMatch = body.match(/## Visao Geral do Dia\n([\s\S]*?)(?=\n## |$)/);
    if (dayMatch) {
      dayOverview = dayMatch[1].trim();
    }

    // Parse Week Overview / Prioridades da Semana section
    let weekOverview = '';
    let weekPrioritiesTable: Array<{ num: number; priority: string; connection: string; status: string }> = [];
    let weekPrioritiesContext = '';
    const weekMatch = body.match(/## Foco da Semana\n([\s\S]*?)(?=\n## |$)/) ||
                      body.match(/## Prioridades da Semana[^\n]*\n([\s\S]*?)(?=\n## |$)/);
    if (weekMatch) {
      const weekContent = weekMatch[1].trim();
      const tableRows = weekContent.match(/\|\s*\d+\s*\|[^\n]+/g);
      if (tableRows) {
        for (const row of tableRows) {
          const cells = row.split('|').map(c => c.trim()).filter(c => c);
          if (cells.length >= 4) {
            weekPrioritiesTable.push({
              num: parseInt(cells[0]) || 0,
              priority: cells[1],
              connection: cells[2],
              status: cells[3],
            });
          }
        }
      }
      const contextMatch = weekContent.match(/\*\*Contexto do quarter:\*\*\s*(.+)/);
      if (contextMatch) {
        weekPrioritiesContext = contextMatch[1].trim();
      }
      const proseLines = weekContent.split('\n')
        .filter(l => !l.startsWith('|') && !l.startsWith('**Nota:') && !l.startsWith('**Contexto do quarter:') && l.trim())
        .join('\n').trim();
      if (proseLines && !proseLines.startsWith('|')) {
        weekOverview = proseLines;
      }
      const noteMatch = weekContent.match(/\*\*Nota:\*\*\s*(.+)/);
      if (noteMatch) {
        weekOverview = (weekOverview ? weekOverview + '\n\n' : '') + noteMatch[1].trim();
      }
    }

    // Parse Immediate Attention section (bullet points + bold sub-headers)
    const immediateAttention: string[] = [];
    const attentionMatch = body.match(/## Atencao Imediata\n([\s\S]*?)(?=\n## |$)/);
    const oldAttentionMatch = body.match(/## Attention Points\n([\s\S]*?)(?=\n## |$)/);
    const attentionContent = attentionMatch?.[1] || oldAttentionMatch?.[1] || '';
    
    if (attentionContent) {
      const lines = attentionContent.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          immediateAttention.push(trimmed.substring(2));
        }
      }
    }

    // Parse Jira In Progress table
    const jiraInProgress: JiraIssue[] = [];
    const jiraInProgressMatch = body.match(/## Jira - Em Andamento[^\n]*\n([\s\S]*?)(?=\n## |$)/);
    if (jiraInProgressMatch) {
      const tableContent = jiraInProgressMatch[1];
      jiraInProgress.push(...this.parseJiraTable(tableContent, true));
    }

    // Parse Jira Pending table
    const jiraPending: JiraIssue[] = [];
    const jiraPendingMatch = body.match(/## Jira - Tarefas Pendentes[^\n]*\n([\s\S]*?)(?=\n## |$)/);
    if (jiraPendingMatch) {
      const tableContent = jiraPendingMatch[1];
      jiraPending.push(...this.parseJiraTable(tableContent, false));
    }

    // Parse Meetings / Meeting Summaries section
    const meetings: Meeting[] = [];
    const meetingsMatch = body.match(/## Reuniões da Semana\n([\s\S]*?)(?=\n## |$)/) ||
                          body.match(/## Reunioes da Semana\n([\s\S]*?)(?=\n## |$)/) ||
                          body.match(/## Resumo das Reunioes[^\n]*\n([\s\S]*?)(?=\n## |$)/);
    const meetingsContent = meetingsMatch?.[1] || '';
    
    if (meetingsContent) {
      meetings.push(...this.parseMeetings(meetingsContent));
    }

    // Parse Blockers section
    const blockers: string[] = [];
    const blockersMatch = body.match(/## Blockers Ativos\n([\s\S]*?)(?=\n## |$)/);
    if (blockersMatch) {
      const lines = blockersMatch[1].split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        // Match numbered list (1. **item**) or bullet list (- **item**)
        const numberedMatch = trimmed.match(/^\d+\.\s*\*\*([^*]+)\*\*\s*[-–]?\s*(.*)$/);
        const bulletMatch = trimmed.match(/^[-*]\s*\*\*([^*]+)\*\*\s*[-–]?\s*(.*)$/);
        if (numberedMatch) {
          blockers.push(`${numberedMatch[1]}${numberedMatch[2] ? ' - ' + numberedMatch[2] : ''}`);
        } else if (bulletMatch) {
          blockers.push(`${bulletMatch[1]}${bulletMatch[2] ? ' - ' + bulletMatch[2] : ''}`);
        } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          blockers.push(trimmed.substring(2));
        }
      }
    }

    // Parse proposed todos -- supports "To-Do's Sugeridos", "To-Dos Propostos", and "Today's Three (P1)" formats
    const proposedTodos: Array<{ text: string; priority: 'P1' | 'P2'; source: string; description?: string }> = [];
    
    // Try new format first: "Today's Three (P1)" with separate "Tambem no Radar (P2)"
    const todaysThreeMatch = body.match(/## Today's Three \(P1\)\n([\s\S]*?)(?=\n## |$)/);
    if (todaysThreeMatch) {
      const fullContent = todaysThreeMatch[1];
      const p2Split = fullContent.split(/### Tambem no Radar \(P2\)/);
      const p1Content = p2Split[0] || '';
      const p2Content = p2Split[1] || '';
      
      this.extractTodosFromLines(p1Content, 'P1', proposedTodos);
      this.extractTodosFromLines(p2Content, 'P2', proposedTodos);
    } else {
      // Fall back to legacy formats
      const todosMatch = body.match(/## To-Do's Sugeridos\n([\s\S]*?)(?=\n## |$)/);
      const oldTodosMatch = body.match(/## To-Dos Propostos\n([\s\S]*?)(?=\n## |$)/);
      const todosContent = todosMatch?.[1] || oldTodosMatch?.[1] || '';
      
      if (todosContent) {
        let currentPriority: 'P1' | 'P2' = 'P2';
        const lines = todosContent.split('\n');
        let lastTodoIndex = -1;
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (line.includes('Alta Prioridade') || line.includes('P1')) currentPriority = 'P1';
          else if (line.includes('Media Prioridade') || line.includes('P2')) currentPriority = 'P2';
          
          const taskMatch = line.match(/^- \[ \] (.+)$/);
          if (taskMatch) {
            proposedTodos.push({
              text: taskMatch[1].replace(/^\*\*/, '').replace(/\*\*$/, '').replace(/\*\*\s*-\s*/, ' - '),
              priority: currentPriority,
              source: 'briefing',
            });
            lastTodoIndex = proposedTodos.length - 1;
          }
          
          if (lastTodoIndex >= 0) {
            const descMatch = line.match(/^\s*>\s*(.+)$/) || line.match(/^\s{2,}(.+)$/);
            if (descMatch && !line.match(/^- \[/)) {
              const existingDesc = proposedTodos[lastTodoIndex].description;
              proposedTodos[lastTodoIndex].description = existingDesc 
                ? `${existingDesc} ${descMatch[1].trim()}` 
                : descMatch[1].trim();
            }
          }
        }
      }
    }

    // Parse Team Initiatives section
    const teamInitiatives = this.parseTeamInitiatives(body);

    // Parse Agenda do Dia (schedule table)
    const schedule: ScheduleEntry[] = [];
    let scheduleLoad = '';
    let tomorrowPreview = '';
    const scheduleMatch = body.match(/## Agenda do Dia\n([\s\S]*?)(?=\n## |$)/);
    if (scheduleMatch) {
      const scheduleContent = scheduleMatch[1];
      const tableLines = scheduleContent.split('\n').filter(l => l.includes('|') && !l.includes('---') && !l.includes('Horario'));
      for (const line of tableLines) {
        const cells = line.split('|').map(c => c.trim()).filter(c => c);
        if (cells.length >= 3) {
          const linkMatch = cells[3]?.match(/\[([^\]]+)\]\(([^)]+)\)/);
          schedule.push({
            time: cells[0],
            title: cells[1],
            participants: cells[2],
            link: linkMatch ? linkMatch[2] : null,
          });
        }
      }
      const loadMatch = scheduleContent.match(/\*\*Carga do dia:\*\*\s*([^\n]+)/);
      if (loadMatch) scheduleLoad = loadMatch[1].trim();
      const tomorrowMatch = scheduleContent.match(/\*\*(?:Amanha|Segunda-feira|Amanhã)[^:]*:\*\*\s*([^\n]+)/);
      if (tomorrowMatch) tomorrowPreview = tomorrowMatch[1].trim();
    }

    // Parse Meeting Prep section
    const meetingPrep: MeetingPrepEntry[] = [];
    const prepMatch = body.match(/## Meeting Prep\n([\s\S]*?)(?=\n## |$)/);
    if (prepMatch) {
      const prepBlocks = prepMatch[1].split(/(?=### )/);
      for (const block of prepBlocks) {
        if (!block.trim() || !block.startsWith('### ')) continue;
        const headerMatch = block.match(/### ([^-\n]+)(?:\s*-\s*(\d{1,2}:\d{2}))?/);
        if (!headerMatch) continue;
        const participantsMatch = block.match(/\*\*Participantes:\*\*\s*([^\n]+)/);
        const lastMatch = block.match(/\*\*Ultima vez:\*\*\s*([^\n]+)/);
        const openMatch = block.match(/\*\*Open items[^:]*:\*\*\s*([^\n]+)/);
        const contextMatch = block.match(/\*\*Contexto[^:]*:\*\*\s*([^\n]+)/);
        const sugMatch = block.match(/\*\*Sugestao:\*\*\s*([^\n]+)/);
        const missingPages: string[] = [];
        const missingMatch = block.match(/Sem person page para ([^\n.—]+)/g);
        if (missingMatch) {
          for (const m of missingMatch) {
            missingPages.push(m.replace('Sem person page para ', '').trim());
          }
        }
        meetingPrep.push({
          title: headerMatch[1].trim(),
          time: headerMatch[2] || '',
          participants: participantsMatch?.[1]?.trim() || '',
          lastMeeting: lastMatch?.[1]?.trim() || '',
          openItems: openMatch?.[1]?.trim() || '',
          recentContext: contextMatch?.[1]?.trim() || '',
          suggestion: sugMatch?.[1]?.trim() || '',
          missingPersonPages: missingPages,
        });
      }
    }

    // Compute stats from parsed data
    stats.meetings = schedule.length || meetings.length || stats.meetings;
    stats.actionItems = proposedTodos.filter(t => t.priority === 'P1').length || stats.actionItems;
    stats.blockers = blockers.length || stats.blockers;
    stats.jiraInProgress = teamInitiatives.subscriptions.length + teamInitiatives.b2b.filter(i => i.status.toLowerCase().includes('progress')).length || stats.jiraInProgress;
    stats.jiraPending = jiraPending.length || stats.jiraPending;

    return {
      date,
      dayOverview,
      weekOverview,
      weekPrioritiesTable,
      weekPrioritiesContext,
      immediateAttention,
      proposedTodos,
      stats,
      jiraInProgress,
      jiraPending,
      meetings,
      blockers,
      teamInitiatives,
      schedule,
      scheduleLoad,
      tomorrowPreview,
      meetingPrep,
    };
  }

  private parseJiraTable(tableContent: string, includeUpdated: boolean): JiraIssue[] {
    const issues: JiraIssue[] = [];
    const lines = tableContent.split('\n');
    
    for (const line of lines) {
      // Skip header and separator lines
      if (line.includes('---') || line.includes('Key') || line.includes('Titulo') || !line.includes('|')) {
        continue;
      }
      
      // Parse table row: | [KEY](url) | Title | Assignee | Priority | Updated? |
      const cells = line.split('|').map(c => c.trim()).filter(c => c);
      if (cells.length >= 4) {
        // Extract key and url from markdown link [KEY](url)
        const linkMatch = cells[0].match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          const issue: JiraIssue = {
            key: linkMatch[1],
            url: linkMatch[2],
            title: cells[1],
            assignee: cells[2] || '-',
            priority: cells[3],
          };
          if (includeUpdated && cells.length >= 5) {
            issue.updated = cells[4];
          }
          issues.push(issue);
        }
      }
    }
    
    return issues;
  }

  private parseMeetings(meetingsContent: string): Meeting[] {
    const meetings: Meeting[] = [];
    
    // Split by meeting headers (### Title - Date)
    const meetingBlocks = meetingsContent.split(/(?=### )/);
    
    for (const block of meetingBlocks) {
      if (!block.trim() || !block.startsWith('### ')) continue;
      
      // Parse meeting header: ### Title - Date
      const headerMatch = block.match(/### ([^-\n]+)(?:\s*-\s*(\d{4}-\d{2}-\d{2}))?/);
      if (!headerMatch) continue;
      
      const title = headerMatch[1].trim();
      const date = headerMatch[2] || '';
      
      // Parse participants
      const participantsMatch = block.match(/\*\*Participantes:\*\*\s*([^\n]+)/);
      const participants = participantsMatch?.[1]?.trim() || '';
      
      // Parse duration
      const durationMatch = block.match(/\*\*Duracao:\*\*\s*([^\n]+)/i) || block.match(/\*\*Duração:\*\*\s*([^\n]+)/);
      const duration = durationMatch?.[1]?.trim() || '';
      
      // Parse summary
      const summaryMatch = block.match(/\*\*Resumo:\*\*\s*([^\n]+)/);
      const summary = summaryMatch?.[1]?.trim() || '';
      
      // Parse decisions
      const decisions: string[] = [];
      const decisionsMatch = block.match(/\*\*Decisões:\*\*\n([\s\S]*?)(?=\n\*\*|$)/i) || 
                             block.match(/\*\*Decisoes:\*\*\n([\s\S]*?)(?=\n\*\*|$)/);
      if (decisionsMatch) {
        const lines = decisionsMatch[1].split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('- ')) {
            decisions.push(trimmed.substring(2));
          }
        }
      }
      
      // Parse action items
      const actionItems: string[] = [];
      const actionMatch = block.match(/\*\*Action Items:\*\*\n([\s\S]*?)(?=\n---|\n###|$)/);
      if (actionMatch) {
        const lines = actionMatch[1].split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('- [ ]') || trimmed.startsWith('- [x]')) {
            actionItems.push(trimmed.substring(6).trim());
          } else if (trimmed.startsWith('- ')) {
            actionItems.push(trimmed.substring(2));
          }
        }
      }
      
      meetings.push({
        title,
        date,
        participants,
        duration,
        summary,
        decisions,
        actionItems,
      });
    }
    
    return meetings;
  }

  private parseTeamInitiatives(body: string): TeamInitiatives {
    const teamInitiatives: TeamInitiatives = {
      subscriptions: [],
      b2b: [],
    };

    // Find the "Iniciativas dos Times" section
    const initiativesMatch = body.match(/## Iniciativas dos Times\n([\s\S]*?)(?=\n## |$)/);
    if (!initiativesMatch) {
      return teamInitiatives;
    }

    const initiativesContent = initiativesMatch[1];

    // Parse Subscriptions subsection
    const subsMatch = initiativesContent.match(/### Subscriptions[^\n]*\n([\s\S]*?)(?=\n### |$)/);
    if (subsMatch) {
      teamInitiatives.subscriptions = this.parseTeamInitiativesTable(subsMatch[1]);
    }

    // Parse B2B subsection
    const b2bMatch = initiativesContent.match(/### B2B[^\n]*\n([\s\S]*?)(?=\n### |$)/);
    if (b2bMatch) {
      teamInitiatives.b2b = this.parseTeamInitiativesTable(b2bMatch[1]);
    }

    return teamInitiatives;
  }

  private parseTeamInitiativesTable(tableContent: string): TeamInitiative[] {
    const initiatives: TeamInitiative[] = [];
    const lines = tableContent.split('\n');

    for (const line of lines) {
      // Skip header, separator lines, and empty lines
      if (line.includes('---') || line.includes('Key') || line.includes('Titulo') || !line.includes('|')) {
        continue;
      }

      // Parse table row: | [KEY](url) | Title | Assignee | Status |
      const cells = line.split('|').map(c => c.trim()).filter(c => c);
      if (cells.length >= 4) {
        // Extract key and url from markdown link [KEY](url)
        const linkMatch = cells[0].match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          initiatives.push({
            key: linkMatch[1],
            url: linkMatch[2],
            title: cells[1],
            assignee: cells[2] || '-',
            status: cells[3] || 'In Progress',
            priority: cells[4] || 'Medium',
          });
        }
      }
    }

    return initiatives;
  }

  private extractTodosFromLines(
    content: string,
    priority: 'P1' | 'P2',
    todos: Array<{ text: string; priority: 'P1' | 'P2'; source: string; description?: string }>
  ): void {
    const lines = content.split('\n');
    let lastTodoIndex = -1;
    for (const line of lines) {
      const taskMatch = line.match(/^- \[ \] (.+)$/);
      if (taskMatch) {
        const text = taskMatch[1]
          .replace(/^\*\*/, '').replace(/\*\*$/, '')
          .replace(/\*\*\s*[-–—]\s*/, ' - ')
          .replace(/\s*\*\(conecta a:[^)]*\)\*$/, '')
          .trim();
        todos.push({ text, priority, source: 'briefing' });
        lastTodoIndex = todos.length - 1;
      } else if (lastTodoIndex >= 0) {
        const descMatch = line.match(/^\s*>\s*(.+)$/) || line.match(/^\s{2,}(.+)$/);
        if (descMatch && !line.match(/^- \[/)) {
          const existingDesc = todos[lastTodoIndex].description;
          todos[lastTodoIndex].description = existingDesc
            ? `${existingDesc} ${descMatch[1].trim()}`
            : descMatch[1].trim();
        }
      }
    }
  }

  // ============ PROGRESS LOG PARSED ============

  async getProgressLogParsed(): Promise<{ entries: ProgressEntry[]; dateRange: { start: string; end: string } }> {
    const filePath = path.join(this.workspacePath, 'to_do\'s', 'progress-log.md');
    let content = '';
    try {
      content = await fs.readFile(filePath, 'utf-8');
    } catch {
      return { entries: [], dateRange: { start: '', end: '' } };
    }

    const entries: ProgressEntry[] = [];
    const dateRegex = /^## (\d{4}-\d{2}-\d{2}) \(([^)]+)\)/gm;
    let match;
    const sections: Array<{ date: string; weekday: string; startIndex: number; endIndex?: number }> = [];

    // Find all date sections
    while ((match = dateRegex.exec(content)) !== null) {
      sections.push({
        date: match[1],
        weekday: match[2],
        startIndex: match.index,
      });
    }

    // Set end indices
    for (let i = 0; i < sections.length; i++) {
      sections[i].endIndex = sections[i + 1]?.startIndex || content.length;
    }

    // Parse each section
    for (const section of sections) {
      const sectionContent = content.substring(section.startIndex, section.endIndex);
      
      const entry: ProgressEntry = {
        date: section.date,
        weekday: section.weekday,
        highlights: this.extractListItems(sectionContent, 'Highlights'),
        decisions: this.extractListItems(sectionContent, 'Decisões Importantes'),
        blockers: this.extractListItems(sectionContent, 'Blockers Ativos'),
        actionItems: this.extractListItems(sectionContent, 'Action Items Críticos'),
        notes: this.extractListItems(sectionContent, 'Notas'),
      };
      
      entries.push(entry);
    }

    // Calculate date range (last 2 weeks from today)
    const today = new Date();
    const twoWeeksAgo = new Date(today);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    
    return {
      entries,
      dateRange: {
        start: twoWeeksAgo.toISOString().split('T')[0],
        end: today.toISOString().split('T')[0],
      },
    };
  }

  private extractListItems(content: string, sectionName: string): string[] {
    const items: string[] = [];
    const sectionRegex = new RegExp(`### ${sectionName}\\n([\\s\\S]*?)(?=\\n### |\\n## |\\n---|\$)`, 'i');
    const match = content.match(sectionRegex);
    
    if (match) {
      const lines = match[1].split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('- ')) {
          items.push(trimmed.substring(2));
        }
      }
    }
    
    return items;
  }
}

// Schema types for cadence-progress.json
interface CadenceProgressSchema {
  initiatives: Record<string, {
    name: string;
    status: 'not_started' | 'in_progress' | 'paused' | 'completed' | 'cancelled';
    priority: 'P1' | 'P2' | 'P3';
    quarter: string;
    current_phase: 'research' | 'one_pager' | 'requirements' | 'user_stories' | 'review' | 'handoff' | '';
    completed_phases: string[];
    documents: Array<{ type: string; path: string; status: string; date: string }>;
    next_actions: string[];
    blockers: string[];
  }>;
  metadata: {
    version: string;
    last_updated: string;
  };
}

// Schema types for onboarding-state.json
interface OnboardingStateSchema {
  onboarding: {
    started: string;
    language: 'en' | 'pt-BR' | 'es-LATAM';
    tier: 'quick' | 'full' | 'power';
    role: string | null;
    completed_steps: string[];
    pending_steps: string[];
    status: 'in_progress' | 'completed';
    context_depth: Record<string, unknown>;
    mcps_configured: string[];
    mcps_suggested: string[];
  };
}

// Types for progress log
interface ProgressEntry {
  date: string;
  weekday: string;
  highlights: string[];
  decisions: string[];
  blockers: string[];
  actionItems: string[];
  notes: string[];
}

// Types for briefing data
interface BriefingStats {
  meetings: number;
  actionItems: number;
  blockers: number;
  jiraInProgress: number;
  jiraPending: number;
}

interface JiraIssue {
  key: string;
  url: string;
  title: string;
  assignee: string;
  priority: string;
  updated?: string;
}

interface TeamInitiative {
  key: string;
  url: string;
  title: string;
  assignee: string;
  status: string;
  priority: string;
}

interface TeamInitiatives {
  subscriptions: TeamInitiative[];
  b2b: TeamInitiative[];
}

interface Meeting {
  title: string;
  date: string;
  participants: string;
  duration: string;
  summary: string;
  decisions: string[];
  actionItems: string[];
}

interface ScheduleEntry {
  time: string;
  title: string;
  participants: string;
  link: string | null;
}

interface MeetingPrepEntry {
  title: string;
  time: string;
  participants: string;
  lastMeeting: string;
  openItems: string;
  recentContext: string;
  suggestion: string;
  missingPersonPages: string[];
}

interface BriefingData {
  date: string;
  dayOverview: string;
  weekOverview: string;
  weekPrioritiesTable: Array<{ num: number; priority: string; connection: string; status: string }>;
  weekPrioritiesContext: string;
  immediateAttention: string[];
  proposedTodos: Array<{
    text: string;
    priority: 'P1' | 'P2';
    source: string;
    description?: string;
  }>;
  stats: BriefingStats;
  jiraInProgress: JiraIssue[];
  jiraPending: JiraIssue[];
  meetings: Meeting[];
  blockers: string[];
  teamInitiatives: TeamInitiatives;
  schedule: ScheduleEntry[];
  scheduleLoad: string;
  tomorrowPreview: string;
  meetingPrep: MeetingPrepEntry[];
}

// Commitment types
interface Commitment {
  what: string;
  who: string;
  since: string;
  context: string;
  taskId?: string;
  completed: boolean;
  daysOld: number;
}

interface CommitmentData {
  iOwe: Commitment[];
  othersOweMe: Commitment[];
  completed: Commitment[];
}

// Initiative types
interface InitiativeDocument {
  type: string;
  path: string;
  status: string;
  date: string;
}

interface Initiative {
  id: string;
  name: string;
  status: string;
  priority: string;
  quarter: string;
  currentPhase: string;
  completedPhases: string[];
  documents: InitiativeDocument[];
  nextActions: string[];
  blockers: string[];
  daysSinceUpdate: number;
  isStale: boolean;
}

interface InitiativeData {
  initiatives: Initiative[];
  lastUpdated: string;
}

// Person types
interface PersonSummary {
  name: string;
  filename: string;
  role: string;
  company: string;
  relationship: string;
  lastInteraction: string;
  openItemsCount: number;
  meetingCount: number;
}
