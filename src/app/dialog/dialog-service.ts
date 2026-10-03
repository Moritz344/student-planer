import { Injectable,signal,inject } from '@angular/core';
import { HomeworkEntry,GradeEntry } from '../types';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  public show = signal<boolean>(false);
  public type = signal<string>("");
  public header = signal<string>("");

  public gradeDataToEdit = signal<GradeEntry>({
    fk_subject: -1,
    grade: 0,
    id: 0
  });

  public homeworkDeleteData = signal<HomeworkEntry>({
    id: 0,
    fk_subject: 0,
    name: "",
    due_date: 0,
    completed: false
  });

  open(header: string,type: string) {
    this.header.set(header);
    this.type.set(type);
    this.show.set(true);
  }

  reset() {
    this.type.set("");
    this.header.set("");
    this.homeworkDeleteData.set({
      id: 0,
      fk_subject: 0,
      name: "",
      due_date: 0,
      completed: false
    });
    this.gradeDataToEdit.set({
      fk_subject: -1,
      grade: 0,
      id: 0
    });
  }

  close() {
    this.reset();
    this.show.set(false);
  }

}
