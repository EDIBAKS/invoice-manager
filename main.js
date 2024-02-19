import { app, BrowserWindow } from 'electron';

let mainWindow;
app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadFile('index.html');
});