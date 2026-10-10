import { Component,computed,inject,EventEmitter,Output,signal } from '@angular/core';
import { TimetableConfig,TimetableDay,TimetableEntry } from '../../types';
import { FormsModule } from '@angular/forms';
import { Electron } from '../../electron';
import { Settings } from '../../settings';
import { buildSchedule } from '../schedule';
import { DialogService } from '../../dialog/dialog-service';

type FieldType = "input" | "select"

interface Question {
  title: string,
  description: string,
  hint: string,
  answer: string | number | null,
  field: FieldType,
  key: keyof Omit<TimetableConfig,'id'>
  skippable: boolean,
}

const DAY_NAMES = ["Montag","Dienstag","Mittwoch","Donnerstag","Freitag"];

@Component({
  selector: 'app-timetable-setup',
  imports: [FormsModule],
  templateUrl: './timetable-setup.html',
  styleUrl: './timetable-setup.css',
})
export class TimetableSetup {
  public electron = inject(Electron);
  public settings = inject(Settings);
  public dialog = inject(DialogService);

  @Output() close = new EventEmitter<void>();

  public timetableConfigData = signal<TimetableConfig>({
    id: 0,
    hour_length: null,
    start_time: null,
    end_time: null,
    break_time: null,
    break_step: null
  });


  public readonly maxQuestionsPerStep = signal<number>(2);

  public readonly questions = signal<Question[]>([
    {
      title: "Wann beginnt bei dir der Unterricht?",
      key: "start_time",
      description: "",
      hint: "z.B 8:15",
      field: "input",
      skippable: false,
      answer: this.timetableConfigData().start_time,
    },
    {
      title: "Wann endet bei dir der Unterricht?",
      key: "end_time",
      field: "input",
      description: "",
      hint: "z.B 13:15",
      skippable: false,
      answer: this.timetableConfigData().end_time,
    },
    {
      title: "Wie lange geht eine Unterrichtsstunde?",
      key: "hour_length",
      field: "input",
      description: "",
      hint: "z.B 45 Minuten",
      skippable: false,
      answer: this.timetableConfigData().hour_length,
    },
    {
      title: "Wann beginnt bei dir eine Pause?",
      key: "break_step",
      field: "input",
      description: "Jede 2 Stunde oder Jede 3 Stunde etc...",
      hint: "z.B 2",
      skippable: false,
      answer: this.timetableConfigData().break_step,
    },
    {
      title: "Wie lange geht bei dir eine Pause?",
      key: "break_time",
      field: "input",
      description: "",
      hint: "z.B 15 Minuten",
      skippable: false,
      answer: this.timetableConfigData().break_time,
    },
  ])

  public timetableData = signal<TimetableDay[]>([]);
  public readonly currentTimetableDay = signal<number>(0);
  public readonly currentDay = computed(() => this.timetableData()[this.currentTimetableDay()]);
  public readonly isFirstDay = computed(() => this.currentTimetableDay() === 0);
  public readonly isLastDay = computed(() => this.currentTimetableDay() === this.timetableData().length - 1);

  public currentStep = signal<number>(0);
  public readonly isFirstStep = computed(() => this.currentStep() === 0);
  public readonly steps = signal<number>(this.questions().length);
  public startWithLessons = signal<boolean>(false);

  constructor() {}

  private createEmptyWeek(): TimetableDay[] {
    const slots = buildSchedule(this.timetableConfigData()).map(slot => ({
      period: slot.period,
      fk_subject: null,
      room: ""
    }));

    return DAY_NAMES.map((name, index) => ({
      day: index + 1,
      name,
      slots: slots.map(slot => ({ ...slot }))
    }));
  }

  nextQuestion() {
    if (this.currentStep() >= this.steps()) {
      return;
    }
    let value = 2;
    if (this.currentStep() + 2 > this.steps()) {
      value = 1;
    }
    this.currentStep.update(v => v + value);
  }

  prevQuestion() {
    if (this.currentStep() <= 0) {
      return;
    }
    const value = 2;
    this.currentStep.update(v => v - value);
  }

  prevDay() {
    if (this.isFirstDay()) {
      return;
    }
    this.currentTimetableDay.update(day => day - 1);
  }

  nextDay() {
    if (this.isLastDay()) {
      return;
    }
    this.currentTimetableDay.update(day => day + 1);
  }

  async onSaveTimetableConfig(): Promise<boolean> {
    this.buildTimeTableConfigData();
    if (this.fieldsAreEmptyForTimetableConfig()) {
      return false;
    }
    this.timetableConfigData.update((config: any) => ({
        ...config,
        hour_length: this.parseNumberInput(config.hour_length),
        break_time: this.parseNumberInput(config.break_time),
        break_step: this.parseNumberInput(config.break_step),
    }));

    await this.electron.updateTimetableConfig(this.timetableConfigData());
    await this.settings.initTimetableConfig();
    return true;
  }

  private parseNumberInput(value: string | number | null): number {
    if (value === null || value === undefined) {
      return 0;
    }
    const match = String(value).match(/\d+/);
    if (!match) {
      return 0;
    }
    return Number(match[0]);
  }


  private buildTimeTableConfigData() {
    const merged: any = this.questions().reduce(
      (acc: any, q) => ({ ...acc, [q.key]: q.answer }),
      { ...this.timetableConfigData() }
    );
    this.timetableConfigData.set(merged);
  }

  private fieldsAreEmptyForTimetableConfig() {
    return this.timetableConfigData().hour_length == null || this.timetableConfigData().start_time == null || this.timetableConfigData().end_time == null || this.timetableConfigData().break_step == null || this.timetableConfigData().break_time == null;
  }

  async finishTimetableConfigQuestions() {
    const isSaved = await this.onSaveTimetableConfig();
    if (!isSaved) {
      this.dialog.open("Felder ausfüllen!","timetableconfig-save-error")
      return;
    }
    this.timetableData.set(this.createEmptyWeek());
    this.currentTimetableDay.set(0);
    this.startWithLessons.set(true);
  }

  async finish() {
    await this.saveTimetable();
    this.close.emit();
  }

  private async saveTimetable() {
    const schedule = buildSchedule(this.timetableConfigData());
    const entries: TimetableEntry[] = this.timetableData().flatMap(day =>
      day.slots
        .filter(slot => slot.fk_subject != null)
        .map(slot => {
          let room: string | null = null;
          if (slot.room) {
            room = slot.room;
          }
          return {
            day: day.day,
            fk_subject: slot.fk_subject,
            start_time: schedule[slot.period - 1].start,
            end_time: schedule[slot.period - 1].end,
            room
          };
        })
    );
    await this.settings.saveTimetable(entries);
  }

}
