const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  exit: () => ipcRenderer.invoke("exit"),
  minimize: () => ipcRenderer.invoke("minimize"),
  getAboutData: () => ipcRenderer.invoke("get-about-data"),
  listSubjects: () => ipcRenderer.invoke("list-subjects"),
  listHomework: () => ipcRenderer.invoke("list-homework"),
  listExam: () => ipcRenderer.invoke("list-exam"),
  listGrades: () => ipcRenderer.invoke("list-grades"),
  listTimetableConfig: () => ipcRenderer.invoke("list-timetable-config"),
  updateTimetableConfig: (config) => ipcRenderer.invoke("update-timetable-config",config),
  deleteHomework: (id) => ipcRenderer.invoke("delete-homework",id),
  resetGrades: () => ipcRenderer.invoke("reset-grades"),
  deleteGrade: (id) => ipcRenderer.invoke("delete-grade",id),
  updateHomework: (homework) => ipcRenderer.invoke("update-homework",homework),
  updateGrade: (grade) => ipcRenderer.invoke("update-grade",grade),
  newExam: (exam) => ipcRenderer.invoke("new-exam",exam),
  openExternalLink: (url) => ipcRenderer.invoke("open-external",url),
});
