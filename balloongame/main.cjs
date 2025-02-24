const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js'), // Optional: für Preload-Skripte, falls verwendet
        },
    });

    // Hole den relativen Pfad zur index.html nach dem Build
    const indexPath = path.join(__dirname, 'dist', 'index.html');

    // Lade die index.html in den BrowserWindow
    mainWindow.loadURL(`file://${indexPath}`);
}


app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
