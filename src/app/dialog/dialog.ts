import { Component,inject, Input, Output, signal,OnInit,EventEmitter } from '@angular/core';
import { Electron } from '../electron';
import { Settings } from '../settings';
import { FormsModule } from '@angular/forms';
import { DialogService } from './dialog-service';
import { Datepicker } from '../datepicker/datepicker';
import { HomeworkEntry,ExamEntry } from '../types';

@Component({
  selector: 'app-dialog',
  imports: [FormsModule, Datepicker],
  templateUrl: './dialog.html',
  styleUrl: './dialog.css',
})
export class Dialog implements OnInit {
  public electron = inject(Electron);
  public settings = inject(Settings);
  public dialogService = inject(DialogService);
  public maxAmountOfCharacters = signal<number>(50);

  public newHomeworkData = signal<HomeworkEntry>({
    id: -1,
    name: "",
    due_date: 0,
    completed: false,
    fk_subject: 1
  })

  public newExamData = signal<ExamEntry>({
    id: -1,
    description: "",
    date: 0,
    fk_subject: 1
  })

  public grades = signal<number[]>([1,2,3,4,5,6])

  public newGradeData = signal<any>({
    id: -1,
    fk_subject: 0,
    grade: 0
  })

  constructor() {
  }

  ngOnInit() {
  }

  onSelectGrade(grade: number) {
    this.newGradeData().grade = grade;
  }

  async onAddHomework() {
    await this.electron.updateHomework(this.newHomeworkData());
    this.settings.initHomeworkData();
    this.dialogService.close();
  }

  async onAddGrade() {
    await this.electron.updateGrade(this.newGradeData());
    this.settings.initGradesData();
    this.dialogService.close();
  }

  async onAddExam() {
    await this.electron.newExam(this.newExamData());
    await this.settings.initExamsData();
    this.dialogService.close();
  }

  async onDeleteHomework() {
    this.electron.deleteHomework(this.dialogService.homeworkDeleteData().id)
    this.settings.initHomeworkData();
    this.dialogService.close();

  }


}
