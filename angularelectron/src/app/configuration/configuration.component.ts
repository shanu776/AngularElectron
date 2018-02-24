import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {
  constructor(private _electronService: ElectronService) {   
  }
  public printers:string[]=[];
  public kotPrinter:string;
  public billPrinter:string;

  ngOnInit() {
  let getSettings = this._electronService.ipcRenderer.sendSync("getSettings");
  this.kotPrinter = getSettings[0].printer_kot;
  this.billPrinter = getSettings[0].printer_bill;

  let printers = this._electronService.ipcRenderer.sendSync("getPrinters");
  printers.forEach(elem => {
    this.printers.push(elem.name);
  });
  
  }

  setKotPrinter = (printer)=>console.log(this._electronService.ipcRenderer.sendSync("setPrinter","printer_kot",printer));
  setBillPrinter = (printer)=>console.log(this._electronService.ipcRenderer.sendSync("setPrinter","printer_bill",printer));
      
}
