import { element } from 'protractor';
import { ElectronService } from 'ngx-electron';
import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private _electronService:ElectronService,private element:ElementRef) {}
  form;
  ngOnInit() {
    this.form = new FormGroup({
      type:new FormControl(""),
      table_no:new FormControl(""),
      mobile:new FormControl(""),
      name:new FormControl(""),
      address:new FormControl(""),
      address2:new FormControl(""),
      item:new FormControl(""),
      comment:new FormControl(""),
      quantity:new FormControl(""),
      price:new FormControl(""),
      total_price:new FormControl("")
    });
  }

  dineInSelect = function(e){
    this.changeFoculeOnTable()
  }

  takeawaySelect = function(e){
    this.focusOnDetails();
  }

  deliverySelect = function(e){
    this.focusOnDetails();
  }

  tableSelect = function(e){
    let code = e.keyCode || e.which;
    if(code==13)
    this.changeFoculeToDefault()
  }

   onSubmit = function(order,e){
    let code = e.keyCode || e.which;
    if(code==13){
     console.log(order);
     let data = this._electronService.ipcRenderer.sendSync('saveOrder',order);
     console.log(data);
     this.changeFoculeOnSubmit();
     this.form.reset();     
    }
   }


  @ViewChild('table') el1:ElementRef
   changeFoculeOnTable(){
    this.el1.nativeElement.focus();
   }

   focusOnDetails(){
    this.el1.nativeElement.parentNode.parentNode.nextElementSibling.children[0].children[0].focus();
   }

   @ViewChild('item') el2:ElementRef
   changeFoculeOnSubmit(){
    this.el2.nativeElement.focus();
   }

   changeFoculeToDefault(){
    this.el2.nativeElement.parentNode.parentNode.nextElementSibling.children[0].children[0].focus();
   }
}
