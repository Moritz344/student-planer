const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  exit: () => ipcRenderer.invoke("exit"),
  minimize: () => ipcRenderer.invoke("minimize"),
  getAboutData: () => ipcRenderer.invoke("get-about-data"),
  listSubjects: () => ipcRenderer.invoke("list-subjects"),
  listHomework: () => ipcRenderer.invoke("list-homework"),
  listExam: () => ipcRenderer.invoke("list-exam"),
  deleteHomework: (id) => ipcRenderer.invoke("delete-homework",id),
  updateHomework: (homework) => ipcRenderer.invoke("update-homework",homework),
  newExam: (exam) => ipcRenderer.invoke("new-exam",exam),
  openExternalLink: (url) => ipcRenderer.invoke("open-external",url),
});
