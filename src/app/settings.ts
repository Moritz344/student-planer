import { Injectable,signal,inject } from '@angular/core';
import { HomeworkEntry,ExamEntry } from './types';
import { Electron } from './electron';

@Injectable({
  providedIn: 'root',
})
export class Settings {
  public electron = inject(Electron);
  public view = signal<"timetable" | "grades" | "home" | "exams">("grades");
  public showAbout = signal<boolean>(false);

  public homeworkData = signal<HomeworkEntry[]>([]);
  public examsData = signal<ExamEntry[]>([]);
  public gradesData = signal<any[]>([]);
  public averageGrade = signal<number>(0);
  public subjectData = signal<any[]>([]);

  constructor() {
    this.initSubjectsData();
    this.initGradesData();
  }

  async initHomeworkData() {
    this.homeworkData.set(await this.electron.getHomework());
      this.homeworkData.update(list =>
        list.map(item => ({
            ...item,
            subjectData: this.getSubjectDataFromId(item.fk_subject) 
        }))
    )
    this.sortHomeworkDataByClosestDate();
  }

  async initGradesData() {
    this.gradesData.set(await this.electron.getGrades());
    this.calculateAverageGradeOfAll();
  }

  calculateAverageGradeOfAll() {
    if (this.gradesData().length == 0 ) {
      return;
    }
    let sumOfAllGrades = this.gradesData().reduce((acc,currentValue) => acc + currentValue.grade,0)
    let gradesQuantity = this.gradesData().length;
    const averageGradeNotRounded = (sumOfAllGrades / gradesQuantity).toFixed(2);
    this.averageGrade.set(Number(averageGradeNotRounded))
    
  }

  async initSubjectsData() {
    this.subjectData.set(await this.electron.getSubjects());
  }

  getSubjectDataFromId(id: number) {
    return this.subjectData().find(s => s.id == id);
  }

  getGradeColor(grade: number) {
    if (grade < 3) {
      return "green";
    } else if (grade <= 4) {
      return "orange"
    } else {
      return "red"
    }
  }

  async initExamsData() {
    this.examsData.set(await this.electron.getExam());
    this.examsData.update(exam => 
      exam.map(item => ({
        ...item,
        daysLeft: Math.ceil((Number(item.date) - Date.now()) / 86400000) || 0,
        subjectData: this.getSubjectDataFromId(item.fk_subject)
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
