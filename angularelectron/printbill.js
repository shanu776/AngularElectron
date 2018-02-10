
const {app, BrowserWindow, Menu, ipcMain,dialog} = require('electron')
const receipt = require('receipt');
const Printer = require('electron-printer');
const ntprinter = require('node-thermal-printer')
 
receipt.config.currency = '';
receipt.config.width = 60;
receipt.config.ruler = '-';
 
const output = receipt.create([
    { type: 'text', value: [
        'MY AWESOME STORE',
        '123 STORE ST',
        'store@store.com',
        'www.store.com'
    ], align: 'center' },
    { type: 'empty' },
    { type: 'properties', lines: [
        { name: 'Order Number', value: 'XXXXXXXXXXXX' },
        { name: 'Date', value: 'XX/XX/XXXX XX:XX' }
    ] },
    { type: 'table', lines: [
        { item: 'Product 1', qty: 1, cost: 1000 },
        { item: 'Product 2 with a really long name', qty: 1, cost: 17500, discount: { type: 'absolute', value: 1000 } },
        { item: 'Another product wth quite a name', qty: 2, cost: 900 },
        { item: 'Product 4', qty: 1, cost: 80, discount: { type: 'percentage', value: 0.15 } },
        { item: 'This length is ridiculously lengthy', qty: 14, cost: 8516 },
        { item: 'Product 6', qty: 3, cost: 500 },
        { item: 'Product 7', qty: 3, cost: 500, discount: { type: 'absolute', value: 500, message: '3 for the price of 2' } }
    ] },
    { type: 'empty' },
    { type: 'text', value: 'Some extra information to add to the footer of this docket.', align: 'center' },
    { type: 'empty' },
    { type: 'properties', lines: [
        { name: 'GST (10.00%)', value: 'AUD XX.XX' },
        { name: 'Total amount (excl. GST)', value: 'AUD XX.XX' },
        { name: 'Total amount (incl. GST)', value: 'AUD XX.XX' }
    ] },
    { type: 'empty' },
    { type: 'properties', lines: [
        { name: 'Amount Received', value: 'AUD XX.XX' },
        { name: 'Amount Returned', value: 'AUD XX.XX' }
    ] },
    { type: 'empty' },
    { type: 'text', value: 'Final bits of text at the very base of a docket. This text wraps around as well!', align: 'center', padding: 5 }
]);

/* ntprinter.init({
    type: 'star',                                     // Printer type: 'star' or 'epson'
    interface: '/dev/usb/lp0',                        // Printer interface
    characterSet: 'SLOVENIA',                         // Printer character set
    removeSpecialCharacters: false,                   // Removes special characters - default: false
    replaceSpecialCharacters: true                 // Adds additional special characters to those listed in the config files
  });
 ntprinter.print("hello world"); */

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