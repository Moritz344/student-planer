import { Component,inject,signal } from '@angular/core';
import { Electron } from '../electron';
import { Settings } from '../settings';
import { DatePipe } from '@angular/common';
import { ExamEntry } from '../types';

@Component({
  selector: 'app-exams',
  imports: [DatePipe],
  templateUrl: './exams.html',
  styleUrl: './exams.css',
})
export class Exams {
  public electron = inject(Electron);
  public settings = inject(Settings);

  constructor() {
    this.settings.initExamsData().then(
      () => {
        this.calculateDaysLeftForExam()
        this.sortExamEntriesByClosestDate()
      }
    );
  }

  sortExamEntriesByClosestDate() {
    this.settings.examsData.update(list =>
      [...list].sort((a: ExamEntry, b: ExamEntry) => {
        const an = Number(a.daysLeft)
        const bn = Number(b.daysLeft);
        if ((an >= 0) !== (bn >= 0)) return an >= 0 ? -1 : 1;
        return an - bn;
      })
    );
  }

  calculateDaysLeftForExam() {
      this.settings.examsData.update(exam => 
        exam.map(item => ({
          ...item,
          daysLeft: Math.ceil((Number(item.date) - Date.now()) / 86400000) || 0
        }))
      )
  }



}
