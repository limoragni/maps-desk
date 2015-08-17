let app = require('app');
let BrowserWindow = require('browser-window');

require('crash-reporter').start();

var mainWindow = null;

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit();
    }
});


app.on('ready', () => {
    if(process.platform === "darwin"){
        mainWindow = new BrowserWindow({
            width: 1200,
            height: 706,
            'min-width': 1200,
            'min-height': 706,
            fullscreen: false,
            title: 'Maps.'
        });
    }else{
        mainWindow = new BrowserWindow({
            width: 1366,
            height: 706,
            'min-width': 1200,
            'min-height': 706,
            kiosk: true,
            fullscreen: true,
            title: 'Maps.'
        });
    }


    // if(process.env['DEVELOPMENT'])
    mainWindow.toggleDevTools();

    // mainWindow.maximize();
    mainWindow.loadUrl('file://' + __dirname + '/../renderer/index.html');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});
