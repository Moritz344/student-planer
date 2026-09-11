import { Component, inject, output, signal } from '@angular/core';
import { Dialog } from '../dialog/dialog';
import { Electron } from '../electron';

export interface AboutData {
  name: string;
  version: string;
  description: string;
  author?: string;
}

@Component({
  selector: 'app-about-dialog',
  imports: [Dialog],
  templateUrl: './about-dialog.html',
  styleUrl: './about-dialog.css',
})
export class AboutDialog {
  private electron = inject(Electron);

  aboutData = signal<any>(null);
  close = output<void>();

  constructor() {
    this.loadData();
  }

  async loadData() {
    const data = await this.electron.getAboutData();
    console.log(data);
    this.aboutData.set(data);
  }

  onClose() {
    this.close.emit();
  }
}
