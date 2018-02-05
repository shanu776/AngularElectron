const {app, BrowserWindow, Menu, ipcMain,dialog} = require('electron')
const path = require('path')
const url = require('url')

var knex = require("knex")({
	client: "sqlite3",
	connection: {
		filename: "./database.sqlite"
	}
});
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({frame:false,width: 1366, height: 768})

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.setMenu(null);
  win.webContents.openDevTools();
  // Open the DevTools.
  // win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

 
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

 /* ***************
  ****DAtabase related Code
  ******************8 */
// code related to current table orders
ipcMain.on("saveOrder",function(event,table_order){
  knex.insert(table_order).into("table_order")
  .on('query-error', function(error, obj){
    dialog.showMessageBox(error);
  })
  .then(function (id) {
    event.returnValue = "data inserted and id = "+id;
  })
});

ipcMain.on("getOrderAccTable",function(event,table_no){
  knex.from('table_order').select().where('table_no', '=', table_no)
  .on('query-error', function(error, obj){
    dialog.showMessageBox(error);
  })
  .then(function (data) {
    event.returnValue = data;
  })
});

ipcMain.on("getAnotherOrder",function(event){
  knex.from('table_order').select().where('table_no', '=', '')
  .on('query-error', function(error, obj){
    dialog.showMessageBox(error);
  })
  .then(function (data) {
    event.returnValue = data;
  })
});

ipcMain.on("deleteCurrentTableOrder",function(event,id){
  knex('table_order').where('id',id).del()
  .on('query-error', function(error, obj){
    dialog.showMessageBox(error);
  })
  .then(function (data) {
    event.returnValue = "Delete "+data;
  })
});

ipcMain.on("mainWindowLoaded", function(event){
  let result = knex.select("FirstName").from("User")
  result.then(function(rows){
    event.returnValue = rows;
  })
});

//Code Related To Product Table

ipcMain.on("addProduct",function(event,product){
  knex.insert(product).into("product")
  .on('query-error', function(error, obj){
    dialog.showMessageBox(error);
  })
  .then(function (id) {
    event.returnValue = "data inserted and id = "+id;
  })
});

ipcMain.on("searchProduct",function(event,keyword){
  knex.from('product').select()
  .on('query-error', function(error, obj){
    dialog.showMessageBox(error);
  })
  .then(function (data) {
    event.returnValue = data;
  })
});