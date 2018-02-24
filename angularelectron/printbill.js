const {app, BrowserWindow, Menu, ipcMain,dialog} = require('electron')
const receipt = require('receipt');
const Printer = require('electron-printer');
const ntprinter = require('node-thermal-printer')

  /* =========================================Prepare JSON Object=============== */
  function prepareItemFk(el,id){
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
  }
  
  ipcMain.on("addOrderHistory",function(event,history_data){   
    knex.insert(history_data).into("order_history")
    .on('query-error', function(error, obj){
      dialog.showMessageBox(error);
    })
    .then(function (id) {
      knex.from('table_order').select().where('table_no', '=', history_data.table_no)
      .then(function(data){
          //console.log(data);
          let user_detail = prepareUserDetail(data[(data.length)-1]);
          data.forEach(el => {
              let item = prepareItemFk(el,id[0]);
              knex.insert(item).into("item_fk")
              .then(function(data){
              });
          });
          knex('table_order').where('table_no',history_data.table_no).del()
          .then(function (data) {
            console.log("data clear from table_order");
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
      console.log(id);
      generateBill(id[0]);
      event.returnValue = "data is saved on id ="+id;
    });
  });

  function generateBill(id){
    knex.from('order_history').select().where('id','=',id)
    .then(function(data){
      knex.from('item_fk').select().where('order_history_id',data[0].id)
      .then(function(itemData){
          status = printBill(data[0],itemData);
          console.log(status);
      });
    });
  }


/* ===============================================Receipt and Printer Operation===========================  */

T_B_ON = new Buffer([0x1b, 0x45, 0x01]);
T_B_OFF = new Buffer([0x1b, 0x45, 0x00]);
T_2HEIGHT = new Buffer([0x1b, 0x21, 0x10]);
T_NORMAL = new Buffer([0x1b, 0x21, 0x00]);
PAPER_FULL_CUT = new Buffer([0x1d, 0x56, 0x00]); // Full cut paper
PAPER_PART_CUT = new Buffer([0x1d, 0x56, 0x01]); // Partial cut paper
TXT_FONT_A = new Buffer([0x1b, 0x4d, 0x00]); // Font type A
TXT_FONT_B = new Buffer([0x1b, 0x4d, 0x01]); // Font type B
TXT_ALIGN_LT = new Buffer([0x1b, 0x61, 0x00]); // Left justification
TXT_ALIGN_CT = new Buffer([0x1b, 0x61, 0x01]); // Centering
TXT_ALIGN_RT = new Buffer([0x1b, 0x61, 0x02]); // Right justification
CHARCODE_USA = new Buffer([0x1b, 0x52, 0x00]); // USA
TXT_4SQUARE = new Buffer([0x1b, 0x21, 0x30]); // Quad area text
BEEP = new Buffer([0x1b, 0x1e]);

function Bold() {
    return BEEP+T_B_ON+TXT_FONT_B+"";
}
function Normal() {
    return T_B_OFF;
}

receipt.config.currency = '';
receipt.config.width = 45;
receipt.config.ruler = '-';


var knex = require("knex")({
	client: "sqlite3",
	connection: {
        filename: "./database.sqlite"
	}
});

/* ===============================================Create Receipt For Bill and Print===========================  */
function printBill(cal,items){
    let message;
    let receiptItem = [];
    items.forEach((el,key) => {
        receiptItem.push({no: key, item: el.name, qty: el.quantity, cost: el.total_price});
    });
    const output = receipt.create([
    { type: 'text', value: [
        Bold()+'    DesiChulhaa(Baner)'+Normal(),
                'baner road, Balewadt Phata,Shrinath Complex',
                '27BAVPK2884A1ZF',
                '8087164638/8087164738'
    ], align: 'center' },
    { type: 'empty' },
    { type: 'properties', lines: [
        { name: 'Order Number', value: 'XXXXXXXXXXXX' },
        { name: 'Date', value: 'XX/XX/XXXX XX:XX' }
    ] },
    { type: 'table', lines: receiptItem },
    { type: 'customTable',lines:[
        {ltext:'',lvalue:'Total',rtext: cal.total_quantity,rvalue: cal.gtotal_price},
        {ltext:'',lvalue:'',rtext: 'CGST (2.5%)',rvalue: ''},
        {ltext:'',lvalue:'',rtext: 'SGST (2.5%)',rvalue: ''}
    ]},
    { type: 'customRuler' },
    { type: 'empty' },
    { type: 'properties', lines: [
        { name: 'Amount Received', value: 'AUD XX.XX' },
        { name: 'Amount Returned', value: 'AUD XX.XX' }
    ] },
    { type: 'empty' },
    { type: 'text', value: 'Final bits of text at the very base of a docket. This text wraps around as well!', align: 'center', padding: 5 },
    { type: 'text', value: ''+PAPER_PART_CUT}
]);

Printer.printDirect({
    data: output,
    printer: 'Two Pilots Demo Printer',
    type: 'RAW',
    docname: 'Test',
    success: function (jobID) {
       message = 'sent to printer with ID: ' + jobID;
    },
    error: function (err) {
        message = err;
    }
});
    return message;
}

/* ===============================================Create Receipt For Kot and Print===========================  */

ipcMain.on("printKot",function(event,table_no){
    knex.from('table_order').select().where('table_no', '=', table_no)
    .then(data=>{
        let kotdata = [];
        data.forEach((elem,key)=>{
            if(elem.kot == 0 && elem.total_kot<elem.quantity){
                if(elem.comment == '' || elem.comment==null){
                    kotdata.push({no: key, item: elem.item, comment: '----', qty: (elem.quantity-elem.total_kot)});
                }else{
                    kotdata.push({no: key, item: elem.item, comment: elem.comment, qty: (elem.quantity-elem.total_kot)});
            }
                updateKot(elem.id,1,elem.quantity);
            }
        });
        if(kotdata.length>0)
            event.returnValue = printKot(kotdata);
                else
                    event.returnValue = "kot already generated";
    });
});

function printKot(kotdata){
    let message;
    const output = receipt.create([
        {type:'text',value:Bold()},
        {type: 'text',value:'KOT',padding:10,align:'center'},
        { type: 'text', value: [
            Normal()+'   store@store.com'
        ], align: 'center' },
        { type: 'customRuler'},
        { type: 'kot', lines: kotdata },
        { type: 'customRuler' },
        { type: 'text',value: PAPER_PART_CUT+''}
    ]);
    
    Printer.printDirect({
        data: output,
        printer: 'Two Pilots Demo Printer',
        type: 'RAW',
        docname: 'Test',
        success: function (jobID) {
           message = 'sent to printer with ID: ' + jobID;
        },
        error: function (err) {
            message = err;
        }
    });
    //console.log(output);
   return message+"working";
}

function updateKot(id,kot,tkot){
    knex('table_order').where('id', '=', id).update({'kot':kot,'total_kot':tkot})
    .on('query-error',function(error,obj){
      dialog.showMessageBox(error);
    })
    .then(function(data){
      console.log("kot data updated");
    });
  }

ipcMain.on("testPrinter",function(event){
    Printer.printDirect({
        data: output,
        printer: 'Two Pilots Demo Printer',
        type: 'RAW',
        docname: 'Test',
        success: function (jobID) {
            event.returnValue = 'sent to printer with ID: ' + jobID
        },
        error: function (err) {
            console.log(err)
        }
    });
  });

  ipcMain.on("getPrinters",event=>{
      event.returnValue = Printer.getPrinters();
  })

  


  /* ntprinter.init({
    type: 'star',                                     // Printer type: 'star' or 'epson'
    interface: '/dev/usb/lp0',                        // Printer interface
    characterSet: 'SLOVENIA',                         // Printer character set
    removeSpecialCharacters: false,                   // Removes special characters - default: false
    replaceSpecialCharacters: true                 // Adds additional special characters to those listed in the config files
  });
 ntprinter.print("hello world"); */

  