import { Component,inject,signal,computed } from '@angular/core';
import { Electron } from '../electron';
import { Settings } from '../settings';
import { DatePipe } from '@angular/common';
import { DialogService } from '../dialog/dialog-service';
import { FormsModule } from '@angular/forms';
import { ExamEntry } from '../types';

@Component({
  selector: 'app-exams',
  imports: [DatePipe,FormsModule],
  templateUrl: './exams.html',
  styleUrl: './exams.css',
})
export class Exams {
  public electron = inject(Electron);
  public settings = inject(Settings);
  public dialog = inject(DialogService)

  public searchFilter = signal<number>(0);
  public examsData = computed<ExamEntry[]>(() => {
    const data = this.settings.examsData();

    if (this.searchFilter() == 1) {
      return data.filter((x: ExamEntry) => x.daysLeft! < 0);
    } else if (this.searchFilter() == 2) {
      return data.filter((x: ExamEntry) => x.daysLeft! > 0);
    } else {
      return data;
    }
  });

  constructor() {
    this.settings.initExamsData();
  }


  onNewExam() {
    this.dialog.open("Neue Prüfung","new-exam")
    this.dialog.show.set(true);
  }



}
