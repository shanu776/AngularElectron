import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }
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
    })
  }
   onSubmit = function(user,e){
    let code = e.keyCode || e.which;
    if(code==13){
     console.log(user);
    }
   }
}
