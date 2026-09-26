import { Injectable } from '@angular/core';
import { ExamEntry,HomeworkEntry,GradeEntry, SubjectEntry } from './types';

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

  getExam(): Promise<ExamEntry[]> {
    return (window as any).electronAPI.listExam();
  }

  async minimize() {
    return await (window as any).electronAPI.minimize();
  }

  async openExternal(link: string) {
    return await (window as any).electronAPI.openExternalLink(link);
  }

  async getHomework(): Promise<HomeworkEntry[]> {
    return await (window as any).electronAPI.listHomework();
  }

  async newExam(exam: ExamEntry) {
    return await (window as any).electronAPI.newExam(exam);
  }

  async getSubjects(): Promise<SubjectEntry[]> {
    return await (window as any).electronAPI.listSubjects();
  }

  async getGrades(): Promise<GradeEntry[]> {
    return await (window as any).electronAPI.listGrades();
  }

  async updateGrade(grade: GradeEntry) {
    return await (window as any).electronAPI.updateGrade(grade);
  }

  async updateHomework(homework: { id: number,completed: boolean}) {
    return await (window as any).electronAPI.updateHomework(homework);
  }

}
