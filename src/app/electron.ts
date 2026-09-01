import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Electron {
  constructor() {}


  async exit() {
    return await (window as any).electronAPI.exit();
  }

  async openAbout() {
    return await (window as any).electronAPI.openAbout();
  }

  async getAboutData() {
    return await (window as any).electronAPI.getAboutData();
  }

  async minimize() {
    return await (window as any).electronAPI.minimize();
  }

  async openExternal(link: string) {
    return await (window as any).electronAPI.openExternalLink(link);
  }

  async closeWindow(windowName: string) {
    return await (window as any).electronAPI.closeElectronWindow(windowName);
  }


}
