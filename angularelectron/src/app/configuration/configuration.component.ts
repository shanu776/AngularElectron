import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {
result=[];
  constructor(private _electronService: ElectronService) { 
     let data = this._electronService.ipcRenderer.sendSync('mainWindowLoaded');
  //   this._electronService.ipcRenderer.on('resultSent',function(event,val){
  //     setTimeout(function(){
  //       console.log(val[0].FirstName);        
  //     },10);
  //  });
  data.forEach(element => {
    this.result.push({
      FirstName:element.FirstName
    });
  });
   console.log(this.result);
  
  }

  ngOnInit() {
    console.log(this.result);
  }
  
  rendererCheck = function(){
    console.log(this.result);
    //console.log('work');
  //   this._electronService.ipcRenderer.send('mainWindowLoaded');
  //   this._electronService.ipcRenderer.on('resultSent',function(result,val){
  //     this.results = val;
  //  });
  }


}

interface User{
  FirstName:String;
}