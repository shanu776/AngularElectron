const {app, BrowserWindow, Menu, ipcMain,dialog} = require('electron')

var knex = require("knex")({
	client: "sqlite3",
	connection: {
		filename: "./database.sqlite"
	}
});

ipcMain.on("saveOrder",function(event,table_order){
    knex.from('table_order').select().where('table_no','=',table_order.table_no)
    .andWhere('item_id','=',table_order.item_id)
    .then(function(data){
      if(!data.length>0){                         ///if item is added first time then it will add
        knex.insert(table_order).into("table_order")
        .on('query-error', function(error, obj){
          dialog.showMessageBox(error);
        })
        .then(function (id) {
          event.returnValue = "data inserted and id = "+id;
        })
      }
      else{                                       ///else update only its price and quantity
        knex("table_order").where('id','=',data[0].id).update({
          'quantity':data[0].quantity+parseInt(table_order.quantity),
          'total_price':data[0].total_price+table_order.total_price
        })
        .on('query-error', function(error, obj){
          dialog.showMessageBox(error);
        })
        .then(function (id) {
          event.returnValue = "data Updated and id = "+id;
        })
      }
    });
   
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

  ipcMain.on("getRunningTables",function(event){
    knex.select('table_no as table', knex.raw('SUM(total_price) as total')).from('table_order').where('table_no', '!=', '').groupByRaw('table_no')
    .on('query-error', function(error, obj){
      dialog.showMessageBox(error);
    })
    .then(function (data) {
      event.returnValue = data;
    });
  });


  ipcMain.on("getAnotherOrder",function(event){           //which is not table order
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
    });
  });

  ipcMain.on("eraseOrder",function(event,table_no){
    knex('table_order').where('table_no',table_no).del()
    .on('query-error', function(error, obj){
      dialog.showMessageBox(error);
    })
    .then(function (data) {
      event.returnValue = "Delete "+data;
    });
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
    });
});

ipcMain.on("totalPriceNdQuantity",function(event,table_no){
  knex('table_order').sum('quantity as tquantity').sum('total_price as gtprice').where('table_no', '=', table_no)
    .on('query-error', function(error, obj){
      dialog.showMessageBox(error);
    })
    .then(function (data) {
      event.returnValue = data;
    })
});

ipcMain.on("addOrderHistory",function(event,history_data){
  knex.insert(history_data).into("order_history")
  .on('query-error', function(error, obj){
    dialog.showMessageBox(error);
  })
  .then(function (id) {
    event.returnValue = id;
  })
})