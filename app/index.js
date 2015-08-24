'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');

require('crash-reporter').start();

var mainWindow = null;

app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', function () {
    if (process.platform === "darwin") {
        mainWindow = new BrowserWindow({
            width: 1200,
            height: 706,
            'min-width': 1200,
            'min-height': 706,
            fullscreen: false,
            title: 'Maps.'
        });
    } else {
        mainWindow = new BrowserWindow({
            width: 1366,
            height: 706,
            'min-width': 1200,
            'min-height': 706,
            title: 'Maps.'
        });
    }

    // if(process.env['DEVELOPMENT'])
    mainWindow.toggleDevTools();

    // mainWindow.maximize();
    mainWindow.loadUrl('file://' + __dirname + '/../renderer/index.html');

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
});