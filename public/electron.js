const { app, BrowserWindow} = require ('electron');
const url = require ('url');
const path = require('path');
const { ipcMain} = require('electron');
const { contextIsolated } = require('process');
function CreateMainWinsow(){
    const mainWindow = new BrowserWindow({
        title: 'WorkFastTimer',
        width: 400,
        height:430,
        frame: false,
        titleBarStyle: 'hidden',
        transparent: true,
        resizable: false,
        maximizable: false,
        webPreferences:{
            preload: path.join(__dirname, 'preload.js'),
            contextIsolated: true,
            nodeIntegration: false,
        }
    });

    const startUrl = url.format({
        pathname: path.join(__dirname, '../build/index.html'),//connected to react
        protocol: 'file:',
        slashes:true,
    });

    if (process.platform === 'darwin') {
        mainWindow.setWindowButtonVisibility(false);
    }

    mainWindow.setMenuBarVisibility(false);
    mainWindow.loadURL(startUrl);

    //close
    ipcMain.on('close-app', ()=>{
        app.quit();
    })

    //minimized
    ipcMain.on('mini-app', () =>{
        if(mainWindow) mainWindow.minimize();
    })
}

app.whenReady().then(CreateMainWinsow);