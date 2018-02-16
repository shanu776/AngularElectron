
const {app, BrowserWindow, Menu, ipcMain,dialog} = require('electron')
const receipt = require('receipt');
const Printer = require('electron-printer');
const ntprinter = require('node-thermal-printer')
 
receipt.config.currency = '';
receipt.config.width = 60;
receipt.config.ruler = '-';


var knex = require("knex")({
	client: "sqlite3",
	connection: {
        filename: "./database.sqlite"
	}
});

ipcMain.on("getOrderHistoryById",function(event,id){
    knex.from('order_history').select().where('id','=',36)
    .then(function(data){
      knex.from('item_fk').select().where('order_history_id',data[0].id)
      .then(function(itemData){
          status = printBill(data[0],itemData);
          console.log(status);
      });
    });
  });

  T_B_ON = new Buffer([0x1b, 0x45, 0x01]);
  T_B_OFF = new Buffer([0x1b, 0x45, 0x00]);
  T_2HEIGHT = new Buffer([0x1b, 0x21, 0x10]);
  T_NORMAL = new Buffer([0x1b, 0x21, 0x00]);
  function makeBold(input) {
    return T_B_ON+input+T_NORMAL;
}


function printBill(cal,items){
    let message;
    let receiptItem = [];
    items.forEach((el,key) => {
        receiptItem.push({no: key, item: el.name, qty: el.quantity, cost: el.total_price});
    });
    const output = receipt.create([
    { type: 'text', value: [
        makeBold('Desi Chulhaa'),
                '123 STORE ST',
                'store@store.com',
                'www.store.com'
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
    { type: 'text', value: 'Final bits of text at the very base of a docket. This text wraps around as well!', align: 'center', padding: 5 }
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


  
/* ntprinter.init({
    type: 'star',                                     // Printer type: 'star' or 'epson'
    interface: '/dev/usb/lp0',                        // Printer interface
    characterSet: 'SLOVENIA',                         // Printer character set
    removeSpecialCharacters: false,                   // Removes special characters - default: false
    replaceSpecialCharacters: true                 // Adds additional special characters to those listed in the config files
  });
 ntprinter.print("hello world"); */

