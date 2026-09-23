import { Injectable,signal,inject } from '@angular/core';
import { HomeworkEntry } from '../types';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  public show = signal<boolean>(false);
  public type = signal<string>("");
  public header = signal<string>("");
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


  close() {
    this.type.set("");
    this.header.set("");
    this.show.set(false);
  }

}
