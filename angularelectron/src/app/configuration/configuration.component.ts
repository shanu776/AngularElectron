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

  ngOnInit() {
    
  }

  rendererCheck = function(){
    //console.log('work');
    this._electronService.ipcRenderer.send('mainWindowLoaded');
    this._electronService.ipcRenderer.on('resultSent',function(result,val){
      console.log(val);
   });
  }

}
