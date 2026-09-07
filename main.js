const { app,dialog, BrowserWindow,net, ipcMain, protocol, shell } = require("electron");
const fs = require("fs");
const path = require("path");

let aboutWindow;
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

  //win.webContents.openDevTools();



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

ipcMain.handle("close-electron-window",async(_,name) => {
  if (name == "about") {
    aboutWindow.close();
    aboutWindow = null;
  }
});

ipcMain.handle("open-external", async (_, url) => {
  await shell.openExternal(url);
});



ipcMain.handle("open-about",async () => {
   aboutWindow = new BrowserWindow({
      maxWidth: 400,
      maxHeight: 200,
      frame: false,
      parent: win,
      modal: true,
      webPreferences: {
        contextIsolation: true,
        enableRemoteModule: false,
        preload: path.join(__dirname, "preload.js"),
      },
    });

    //aboutWindow.openDevTools();
    loadAngularRoute(aboutWindow, "about");
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
