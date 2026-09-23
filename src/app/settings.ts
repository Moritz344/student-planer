import { Injectable,signal,inject } from '@angular/core';
import { HomeworkEntry,ExamEntry } from './types';
import { Electron } from './electron';

@Injectable({
  providedIn: 'root',
})
export class Settings {
  public electron = inject(Electron);
  public view = signal<"timetable" | "grades" | "home" | "exams">("home");
  public showAbout = signal<boolean>(false);

  public homeworkData = signal<HomeworkEntry[]>([]);
  public examsData = signal<ExamEntry[]>([]);
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
    this.sortHomeworkDataByClosestDate();
  }

  async initSubjectsData() {
    this.subjectData.set(await this.electron.getSubjects());
  }

  async initExamsData() {
    this.examsData.set(await this.electron.getExam());
    this.examsData.update(exam => 
      exam.map(item => ({
        ...item,
        daysLeft: Math.ceil((Number(item.date) - Date.now()) / 86400000) || 0
      }))
    )
    this.sortExamEntriesByClosestDate();
  }

  sortHomeworkDataByClosestDate() {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayUnixtimestamp = startOfToday.getTime();
    this.homeworkData.update(list =>
      [...list].sort((a: HomeworkEntry, b: HomeworkEntry) => {
        const an = Number(a.due_date) - todayUnixtimestamp;
        const bn = Number(b.due_date) - todayUnixtimestamp;
        if ((an >= 0) !== (bn >= 0)) return an >= 0 ? -1 : 1;
        return an - bn;
      })
    );

  }


  sortExamEntriesByClosestDate() {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const today = startOfToday.getTime();
    this.examsData.update(list =>
      [...list].sort((a: ExamEntry, b: ExamEntry) => {
        const an = Math.floor((Number(a.date) - today) / 86400000);
        const bn = Math.floor((Number(b.date) - today) / 86400000);
        if ((an >= 0) !== (bn >= 0)) return an >= 0 ? -1 : 1;
        return an - bn;
      })
    );
  }

}
