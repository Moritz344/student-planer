import { Component,signal,inject } from '@angular/core';
import { Electron } from '../../electron';
import { Settings } from '../../settings';
import { DatePipe } from '@angular/common';
import { Dialog } from '../../dialog/dialog';
import { FormsModule } from '@angular/forms';
import { HomeworkEntry } from '../../types';
import { DialogService } from '../../dialog/dialog-service';


interface SubjectEntry {
  id: number,
  name: string
}

@Component({
  selector: 'app-homework',
  imports: [DatePipe,FormsModule,Dialog],
  templateUrl: './homework.html',
  styleUrl: './homework.css',
})
export class Homework {
  public electron = inject(Electron);
  public settings = inject(Settings);
  public dialog = inject(DialogService);
  public homeworkData = this.settings.homeworkData;
  public today = new Date()
  public days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

  constructor() {
    this.settings.initHomeworkData();
  }

  onDeleteHomework(homework: HomeworkEntry) {
    this.dialog.open("Hausaufgabe löschen","delete-homework")
    this.dialog.homeworkDeleteData.set(homework)
  }

  onAddHomework() {
    this.dialog.open("Neue Hausaufgabe","new-homework")
  }

  getDayNameFromId(id: number) {
    return this.days[id]
  }

  updateCompletedStatus(homework: HomeworkEntry) {
    this.electron.updateHomework({
      id: homework.id,
      completed: homework.completed
    })
  }

}
