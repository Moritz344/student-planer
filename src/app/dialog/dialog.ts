import { Component,inject, Input, Output, signal,OnInit,EventEmitter } from '@angular/core';
import { Electron } from '../electron';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dialog',
  imports: [FormsModule],
  templateUrl: './dialog.html',
  styleUrl: './dialog.css',
})
export class Dialog implements OnInit {
  @Input("type") type: string = "";
  @Input("header") header: string = "";
  @Output("close") close =  new EventEmitter<void>();

  public electron = inject(Electron);
  public subjectsData = signal<any[]>([]);

  public newHomeworkData = signal<any>({
    name: "",
    fk_subject: 1
  })

  constructor() {
  }

  ngOnInit() {
    if (this.type == "new-homework") {
      this.initSubjects();
    }
  }

  async initSubjects() {
    this.subjectsData.set(await this.electron.getSubjects());
  }

}
