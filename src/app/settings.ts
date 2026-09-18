import { Injectable,signal,inject } from '@angular/core';
import { HomeworkEntry } from './types';
import { Electron } from './electron';

@Injectable({
  providedIn: 'root',
})
export class Settings {
  public electron = inject(Electron);
  public view = signal<"timetable" | "grades" | "home" | "exams">("home");
  public showAbout = signal<boolean>(false);

  public homeworkData = signal<HomeworkEntry[]>([]);
  public subjectData = signal<any[]>([]);

  constructor() {
    this.initSubjectsData();
  }

  async initHomeworkData() {
    this.homeworkData.set(await this.electron.getHomework());
    for (const h of this.homeworkData()) {
      const subject = await this.electron.getSubjectNameFromId(h.fk_subject);
      this.homeworkData.update(list =>
        list.map(item =>
          item.id === h.id ? { ...item, subject } : item
        ));
    }
  }

  async initSubjectsData() {
    this.subjectData.set(await this.electron.getSubjects());
    console.log(this.subjectData());
  }

}
