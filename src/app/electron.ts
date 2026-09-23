import { Injectable,inject } from '@angular/core';

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

  deleteHomework(id: number) {
    return (window as any).electronAPI.deleteHomework(id);
  }

  getExam() {
    return (window as any).electronAPI.listExam();
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

  async newExam(exam: any) {
    return await (window as any).electronAPI.newExam(exam);
  }

  async getSubjects() {
    return await (window as any).electronAPI.listSubjects();
  }

  async updateHomework(homework: any) {
    return await (window as any).electronAPI.updateHomework(homework);
  }

}
