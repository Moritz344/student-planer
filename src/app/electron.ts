import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Electron {
  constructor() {}


  async exit() {
    return await (window as any).electronAPI.exit();
  }

  async getAboutData() {
    return await (window as any).electronAPI.getAboutData();
  }

  async minimize() {
    return await (window as any).electronAPI.minimize();
  }

  async openExternal(link: string) {
    return await (window as any).electronAPI.openExternalLink(link);
  }

  async getHomework() {
    return await (window as any).electronAPI.listHomework();
  }

  async getSubjects() {
    return await (window as any).electronAPI.listSubjects();
  }

  async getSubjectNameFromId(id: number) {
    const subjects = await this.getSubjects()
    return subjects.find((x: any) => x.id == id)
  }

  async updateHomeworkCompletedStatus(homework: { id: number,completed: boolean}) {
    return await (window as any).electronAPI.updateHomeworkStatus(homework);
  }

}
