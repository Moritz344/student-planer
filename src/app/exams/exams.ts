import { Component,inject,signal } from '@angular/core';
import { Electron } from '../electron';
import { Settings } from '../settings';
import { DatePipe } from '@angular/common';
import { DialogService } from '../dialog/dialog-service';

// TODO: delete exam
// TODO: Raum? Uhrzeit?

@Component({
  selector: 'app-exams',
  imports: [DatePipe],
  templateUrl: './exams.html',
  styleUrl: './exams.css',
})
export class Exams {
  public electron = inject(Electron);
  public settings = inject(Settings);
  public dialog = inject(DialogService)

  constructor() {
    this.settings.initExamsData().then(() =>  console.log(this.settings.examsData()));
    
  }

  onNewExam() {
    this.dialog.open("Neue Prüfung","new-exam")
    this.dialog.show.set(true);
  }



}
