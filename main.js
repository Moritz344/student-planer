const { app,dialog, BrowserWindow,net, ipcMain, protocol, shell } = require("electron");
const fs = require("fs");
const path = require("path");

const db = require("./db.cjs");

let win;

async function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    titleBarStyle: "hidden",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.webContents.openDevTools();



}

ipcMain.handle("exit",(_) => {
  app.quit()
});

ipcMain.handle("minimize", (_) => {
  BrowserWindow.getFocusedWindow()?.minimize()
});

ipcMain.handle("get-about-data",async () => {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname,"package.json")));

    return {
        name: pkg.name,
        version: pkg.version,
        description: pkg.description,
        author: pkg.author
      }
    } catch (error) {
      console.log("error:", error);
    }
})

ipcMain.handle("open-external", async (_, url) => {
  await shell.openExternal(url);
});

ipcMain.handle("delete-homework",(_,id) => {
  db.deleteHomework(id)
});

ipcMain.handle("reset-grades",(_) => {
  db.resetGrades()
});

ipcMain.handle("delete-grade",(_,id) => {
  db.deleteGrade(id)
});

ipcMain.handle("list-homework", async (_,) => {
  return db.listHomework();
});

ipcMain.handle("list-exam",(_) => {
  return db.listExam();
});

ipcMain.handle("update-homework", async (_,homework) => {
  return db.updateHomework(homework);
});

ipcMain.handle("update-grade", async (_,grade) => {
  return db.updateGrade(grade);
});

ipcMain.handle("new-exam", async (_,exam) => {
  return db.newExam(exam);
});

ipcMain.handle("list-subjects", async (_,) => {
  return db.listSubjects();
});

ipcMain.handle("list-grades", async (_,) => {
  return db.listGrades();
});


app.whenReady().then(async() => {
    createWindow();
    loadAngularRoute(win);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

function loadAngularRoute(window, route = "") {
  if (process.env.ELECTRON_DEV) {
    window.loadURL(`http://localhost:4200/${route}`);
  } else {
    window.loadFile(path.join(__dirname, 'dist/student-planer-app/browser/index.html'), {
      hash: '/' + route,
    });
  }
}
