const { app, BrowserWindow, ipcMain } = require("electron");
const QRCode = require("qrcode");
const path = require("path");

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: "icon.ico",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.removeMenu(true);
    mainWindow.loadFile("index.html");

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

app.on("ready", createWindow);

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

ipcMain.on("generateQRCode", async (event, url, options) => {
    try {
        const imageData = await QRCode.toDataURL(url, options);
        event.reply("showQRCode", imageData);
    } catch (error) {
        console.error(error);
    }
});
