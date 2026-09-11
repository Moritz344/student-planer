const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  exit: () => ipcRenderer.invoke("exit"),
  minimize: () => ipcRenderer.invoke("minimize"),
  getAboutData: () => ipcRenderer.invoke("get-about-data"),
  openExternalLink: (url) => ipcRenderer.invoke("open-external",url),

});
