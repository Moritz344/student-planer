import { Component,inject,EventEmitter,Output,signal } from '@angular/core';
import { TimetableConfig } from '../../types';
import { FormsModule } from '@angular/forms';

type FieldType = "input" | "select"

interface Question {
  title: string,
  description: string,
  hint: string,
  answer: string | number | null,
  field: FieldType,
  skippable: boolean,
  category: 1 | 2
}

@Component({
  selector: 'app-timetable-setup',
  imports: [FormsModule],
  templateUrl: './timetable-setup.html',
  styleUrl: './timetable-setup.css',
})
export class TimetableSetup {
  @Output() close = new EventEmitter<void>();


  public timetableConfigData = signal<TimetableConfig>({
    id: 0,
    hour_length: null,
    start_time: null,
    end_time: null,
    break_time: null,
    break_step: null
  });

  public timetableData = signal<any>([]);

  public readonly maxQuestionsPerStep = signal<number>(2);

  public readonly questions = signal<Question[]>([
    {
      title: "Wann beginnt bei dir der Unterricht?",
      description: "",
      hint: "z.B 8:15",
      field: "input",
      skippable: false,
      answer: this.timetableConfigData().start_time,
      category: 1
    },
    {
      title: "Wann endet bei dir der Unterricht?",
      field: "input",
      description: "",
      hint: "z.B 13:15",
      skippable: false,
      answer: this.timetableConfigData().end_time,
      category: 1
    },
    {
      title: "Wie lange geht eine Unterrichtsstunde?",
      field: "input",
      description: "",
      hint: "z.B 45 Minuten",
      skippable: false,
      answer: this.timetableConfigData().hour_length,
      category: 1
    },
    {
      title: "Wann beginnt bei dir eine Pause?",
      field: "input",
      description: "Jede 2 Stunde oder Jede 3 Stunde etc...",
      hint: "z.B 2",
      skippable: false,
      answer: this.timetableConfigData().break_step,
      category: 1
    },
    {
      title: "Wie lange geht bei dir eine Pause?",
      field: "input",
      description: "",
      hint: "z.B 15 Minuten",
      skippable: false,
      answer: this.timetableConfigData().break_time,
      category: 1
    },
  ])

  public currentStep = signal<number>(0);
  public readonly steps = signal<number>(this.questions().length);
  public lastQuestion = signal<boolean>(false);

  constructor() {}

  next() {
    if (this.currentStep() >= this.steps()) { return; }
    const value = this.currentStep() + 2 > this.steps() ? 1 : 2;
    this.currentStep.update(v => v + value);

  }

  prev() {
    if (this.currentStep() <= 0) { return; }
    const value = 2;
    this.currentStep.update(v => v - value);
  }

  finish() {
    this.close.emit();
  }

}
