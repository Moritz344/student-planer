import { Component,signal,inject } from '@angular/core';
import { Electron } from '../../electron';

interface HomeworkEntry {
  id: number,
  name: string,
  fk_subject: number,
  due_date: number
}

@Component({
  selector: 'app-homework',
  imports: [],
  templateUrl: './homework.html',
  styleUrl: './homework.css',
})
export class Homework {
  public homeworkData = signal<HomeworkEntry[]>([]);
  public electron = inject(Electron);

  constructor() {
    this.initData();
  }

  async initData() {
    this.homeworkData.set(await this.electron.getHomework());
    console.log(this.homeworkData());
  }
}
