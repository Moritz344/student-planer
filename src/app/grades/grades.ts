import { Component,inject,OnInit } from '@angular/core';
import { Settings } from '../settings';
import { DialogService } from '../dialog/dialog-service';
import { GradeEntry } from '../types';

// TODO: show average grade for each subject with a colored circle
// TODO: weight option

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
  }

  onEditGrade(gradeData: GradeEntry) {
    this.dialog.open("Note Bearbeiten","edit-grade");
    this.dialog.gradeDataToEdit.set(gradeData);
  }


  onNewGrade() {
    this.dialog.open("Note Eintragen","new-grade");
  }


}
