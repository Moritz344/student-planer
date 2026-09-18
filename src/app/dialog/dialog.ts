import { Component,inject, Input, Output, signal,OnInit,EventEmitter } from '@angular/core';
import { Electron } from '../electron';
import { Settings } from '../settings';
import { FormsModule } from '@angular/forms';
import { DialogService } from './dialog-service';

@Component({
  selector: 'app-dialog',
  imports: [FormsModule],
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

  constructor() {
  }

  ngOnInit() {
  }

  async onAddHomework() {
    await this.electron.updateHomework(this.newHomeworkData());
    this.settings.initHomeworkData();
    this.dialogService.close();
  }

  async onDeleteHomework() {

  }


}
