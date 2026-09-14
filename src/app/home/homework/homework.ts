import { Component,signal,inject } from '@angular/core';
import { Electron } from '../../electron';
import { DatePipe } from '@angular/common';
import { Dialog } from '../../dialog/dialog';
import { FormsModule } from '@angular/forms';

interface HomeworkEntry {
  id: number,
  name: string,
  fk_subject: number,
  due_date: number,
  subject: { id: number,name: string },
  completed: boolean

}

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
  public homeworkData = signal<HomeworkEntry[]>([]);
  public electron = inject(Electron);
  public today = new Date()
  public days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  public showNewHomeworkDialog = signal<boolean>(false);

  constructor() {
    this.initData();
  }

  async initData() {
    this.homeworkData.set(await this.electron.getHomework());
    for (const h of this.homeworkData()) {
      const subject = await this.electron.getSubjectNameFromId(h.fk_subject);
      this.homeworkData.update(list =>
        list.map(item =>
          item.id === h.id ? { ...item, subject } : item
        ));
    }
    console.log("Homework:",this.homeworkData());
  }

  getDayNameFromId(id: number) {
    return this.days[id]
  }

  updateCompletedStatus(homework: HomeworkEntry) {
    this.electron.updateHomeworkCompletedStatus({
      id: homework.id,
      completed: homework.completed
    })
  }

}
