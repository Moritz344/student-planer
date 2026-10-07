import { Component,signal,inject } from '@angular/core';
import { Electron } from '../electron';
import { Settings } from '../settings';
import { DialogService } from '../dialog/dialog-service';

interface WeekDay {
  name: string,
  date: string
}

@Component({
  selector: 'app-timetable',
  imports: [],
  templateUrl: './timetable.html',
  styleUrl: './timetable.css',
})
export class Timetable {
  public electron = inject(Electron);
  public settings = inject(Settings);
  public dialog = inject(DialogService);

  public days = signal<WeekDay[]>([]);



  constructor() {
    this.initWeekDays();
    this.settings.initTimetableConfig();
  }


  onCustomizeTimetable() {
    this.dialog.open("Stundenplan Erstellen","create-timetable");
  }

  initWeekDays() {
    const today = new Date();
    const currentDayOfTheWeek = today.getDay();

    let diffToMonday = currentDayOfTheWeek;
    if (currentDayOfTheWeek == 0) {
      diffToMonday -= 6;
    } else {
      diffToMonday = diffToMonday - 1;
    }

    const monday = new Date(today);
    monday.setDate(today.getDate() - diffToMonday)
    monday.setHours(0,0,0,0);

    const weeks: WeekDay[] = [];

    for (let i=0;i<5;i++) {
      const currentDate = new Date(monday);
      currentDate.setDate(monday.getDate() + i)

      weeks.push({
        name: currentDate.toLocaleDateString('de-DE', { weekday: 'short' }),
         date: currentDate.toLocaleDateString('de-DE', {
          day: 'numeric',
          month: 'long',
        }),
      })

      
    }

    this.days.set(weeks);
  }

}
