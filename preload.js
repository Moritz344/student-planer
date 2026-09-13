const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  exit: () => ipcRenderer.invoke("exit"),
  minimize: () => ipcRenderer.invoke("minimize"),
  getAboutData: () => ipcRenderer.invoke("get-about-data"),
  listSubjects: () => ipcRenderer.invoke("list-subjects"),
  listHomework: () => ipcRenderer.invoke("list-homework"),
  openExternalLink: (url) => ipcRenderer.invoke("open-external",url),
});
