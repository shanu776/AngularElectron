import { Component, OnInit} from '@angular/core';
import { ElectronService } from "ngx-electron";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public data;
  constructor(private _electronService:ElectronService){
    setInterval(() => {
      this.data = this._electronService.ipcRenderer.sendSync("getRunningTables");
      this.rows = [];
      this.data.forEach(el => {
        this.rows.push({table:el.table,total:el.total,company:'comp'});
      });
      }, 1000);
   
  }

  //rows = this.data;
  
  rows = [
    /* { table: 'one', total: 'Male', company: 'Swimlane' },
    { table: 'two', total: 'Male', company: 'KFC' },
    { table: 'three', total: 'Female', company: 'Burger King' }, */
  ];
  columns = [
    { name: 'Table' },
    { name: 'Total' },
    { name: 'Company'}
  ];
}
