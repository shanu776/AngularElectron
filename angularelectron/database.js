const ipcMain = require('electron')
function setupConnection(){
    var knex = require("knex")({
        client: "sqlite3",
        connection: {
        filename: "./database.sqlite"
        }
    });
}

function getData(){
    ipcMain.on("mainWindowLoaded", function(event){
		let result = knex.select("FirstName").from("User")
		result.then(function(rows){
      event.returnValue = rows;
    })
	});
}