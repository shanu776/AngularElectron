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
          'total_price':data[0].total_price+table_order.total_price,
          'kot':0
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
    knex.from('product').select().where('sortname','Like',keyword+'%').limit(10)
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

  /* ipcMain.on("addOrderHistory",function(event,history_data){
    console.log(history_data.table_no);
    knex.insert(history_data).into("order_history")
    .on('query-error', function(error, obj){
      dialog.showMessageBox(error);
    })
    .then(function (id) {
      knex.from('table_order').select().where('table_no', '=', history_data.table_no)
      .then(function(data){
          let user_detail = prepareUserDetail(data[(data.length)-1]);
          data.forEach(el => {
              let item = prepareItemFk(el,id[0]);
              knex.insert(item).into("item_fk")
              .then(function(data){
              });
          });
          knex('table_order').where('table_no',history_data.table_no).del()
          .then(function (data) {
            event.returnValue = "Done... "+data;
          });
         
          if(history_data.table_no == ''){
          knex.from('user_detail').select().where('mobile', '=', user_detail.mobile)
          .then(function(data){
              if(data.length>0){
                knex('user_detail').where('id', '=', data[0].id).update({
                  'name':user_detail.name,
                  'address':user_detail.address,
                  'address1':user_detail.address1
                }).then(function(data){});
              }
              else{
                knex.insert(user_detail).into("user_detail").then(function(data){console.log(data)});
              }
          });
        }
      });
    });
  }); */

  
  ipcMain.on("todaysOtherOrder",function(event,type){
    knex.from('order_history').select().where('type','=',type)
    .then(function(data){
      event.returnValue = data;
    });
  });
  
  ipcMain.on("getOrderHistoryById",function(event,id){
    knex.from('order_history').select().where('id','=',36)
    .then(function(data){
      knex.from('item_fk').select().where('order_history_id',data[0].id)
      .then(function(itemData){
         event.returnValue = [data,itemData];
      });
    });
  });
  /* ===================================================Prepare JSON Object============================================ */

/*   function prepareItemFk(el,id){
    return item = {
      'name':el.item,
      'price':el.price,
      'total_price':el.total_price,
      'quantity':el.quantity,
      'order_history_id':id
    };
  }

  function prepareUserDetail(data){
    return user = {
      'name':data.name,
      'address':data.address,
      'address1':data.address2,
      'mobile':data.mobile
    };
  } */