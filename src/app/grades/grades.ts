import { Component,inject,OnInit } from '@angular/core';
import { Settings } from '../settings';
import { DialogService } from '../dialog/dialog-service';

// TODO: show average grade circle in color 
// TODO: show average grade for each subject with a colored circle

@Component({
  selector: 'app-grades',
  imports: [],
  templateUrl: './grades.html',
  styleUrl: './grades.css',
})
export class Grades implements OnInit{
  public settings = inject(Settings)
  public dialog = inject(DialogService)

  constructor() {
  }

  ngOnInit(): void {
    console.log("grades:",this.settings.gradesData());
  }

  onNewGrade() {
    this.dialog.open("Neue Note","new-grade");
  }


}
