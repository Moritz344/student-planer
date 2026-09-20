import { Component,inject } from '@angular/core';
import { Electron } from '../electron';
import { Settings } from '../settings';

@Component({
  selector: 'app-exams',
  imports: [],
  templateUrl: './exams.html',
  styleUrl: './exams.css',
})
export class Exams {
  public electron = inject(Electron);
  public settings = inject(Settings);

  constructor() {
    this.settings.initExamsData();
  }



}
