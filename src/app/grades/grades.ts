import { Component,inject } from '@angular/core';
import { Settings } from '../settings';

@Component({
  selector: 'app-grades',
  imports: [],
  templateUrl: './grades.html',
  styleUrl: './grades.css',
})
export class Grades {
  public settings = inject(Settings)

  constructor() {}


  calculateAverageGrade() {}
}
