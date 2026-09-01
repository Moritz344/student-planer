import { Component,inject,signal,OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Settings } from '../settings';
import { Menu } from './menu/menu'
import { Electron } from '../electron';

@Component({
  selector: 'app-topbar',
  imports: [Menu],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar implements OnInit {
  public settings = inject(Settings);
  public router = inject(Router);
  private route = inject(ActivatedRoute);
  public electron = inject(Electron);

  public menuSelected = signal<boolean>(false);
  public showLeftOptions = signal<boolean>(false);

  constructor() {
  }

  checkRoute() {
    this.route.paramMap.subscribe((obs) => {
      if (obs.get("name") == null) {
        this.showLeftOptions.set(false);
      } else {
        this.showLeftOptions.set(true);
      }
    });
  }
  ngOnInit(): void {
    this.checkRoute();
  }

  onGoBackToHome() {
    this.router.navigate([""]);
  }

  onMinimize() {
    this.electron.minimize();
  }

  onMenu() {
    this.menuSelected.update(x => !x);
  }

  onClose() {
    this.electron.exit();
  }

}
