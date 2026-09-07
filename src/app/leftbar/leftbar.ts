import { Component,signal,inject } from '@angular/core';
import { Settings } from '../settings';

@Component({
  selector: 'app-leftbar',
  imports: [],
  templateUrl: './leftbar.html',
  styleUrl: './leftbar.css',
})
export class Leftbar {
  public settings = inject(Settings);
  constructor() {}

}
