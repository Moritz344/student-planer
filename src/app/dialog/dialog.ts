import { Component,inject, Input, Output, signal,OnInit,EventEmitter } from '@angular/core';
import { Electron } from '../electron';
import { Settings } from '../settings';
import { FormsModule } from '@angular/forms';
import { DialogService } from './dialog-service';
import { Datepicker } from '../datepicker/datepicker';

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

  public newHomeworkData = signal<any>({
    id: -1,
    name: "",
    due_date: 0,
    completed: false,
    fk_subject: 1
  })

  public newExamData = signal<any>({
    id: -1,
    description: "",
    date: 0,
    fk_subject: 1
  })

  constructor() {
  }

  ngOnInit() {
  }

  async onAddHomework() {
    await this.electron.updateHomework(this.newHomeworkData());
    this.settings.initHomeworkData();
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
