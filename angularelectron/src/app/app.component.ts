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
      }, 1000);
   
  }

}
