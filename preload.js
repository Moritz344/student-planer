const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  exit: () => ipcRenderer.invoke("exit"),
  minimize: () => ipcRenderer.invoke("minimize"),
  openAbout: () => ipcRenderer.invoke("open-about"),
  getAboutData: () => ipcRenderer.invoke("get-about-data"),
  openExternalLink: (url) => ipcRenderer.invoke("open-external",url),
  closeElectronWindow: (name) => ipcRenderer.invoke("close-electron-window",name),

});
