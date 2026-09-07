import { Injectable,signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Settings {
  public view = signal<"timetable" | "grades" | "home" | "exams">("home");
  constructor() {}
}
