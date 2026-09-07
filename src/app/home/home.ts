import { Component,inject,signal } from '@angular/core';
import { Topbar } from '../topbar/topbar';
import { Leftbar } from '../leftbar/leftbar';
import { Settings } from '../settings';
import { Grades } from '../grades/grades';
import { Timetable } from '../timetable/timetable';
import { Exams } from '../exams/exams';

@Component({
  selector: 'app-home',
  imports: [Topbar,Leftbar,Grades,Timetable,Exams],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  public settings = inject(Settings);

}
