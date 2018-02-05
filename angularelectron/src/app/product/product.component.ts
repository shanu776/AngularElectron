import { element } from 'protractor';
import { DomSanitizer,SafeHtml } from '@angular/platform-browser'
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Ng2AutoCompleteComponent } from 'ng2-auto-complete';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ElectronService } from 'ngx-electron'

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
 
 
  public continents = [/* {
    id: 1,
    name: 'Asia',
    population: '4,157,300,000'
  }, {
    id: 2,
    name: 'Africa',
    population: '1,030,400,000'
  }, {
    id: 3,
    name: 'Europe',
    population: '738,600, 000'
  }, {
    id: 4,
    name: 'North America',
    population: '461,114,000'
  }, {
    id: 5,
    name: 'South America',
    population: '390,700,000'
  }, {
    id: 6,
    name: 'Australia',
    population: '36,700,000'
  }, {
    id: 7,
    name: 'Antartica',
    population: 0
  } */
  ];

public myForm: FormGroup;

constructor(private builder: FormBuilder, private _sanitizer: DomSanitizer,private _electronService:ElectronService) {  }

ngOnInit() {
  let data = this._electronService.ipcRenderer.sendSync('searchProduct',"kk");
  //console.log(data);
  data.forEach(element => {
    this.continents.push({
                      'id':element.id,
                      'sortname':element.sortname,
                      'name':element.item,
                      'price':element.price
                    });
  });
  this.myForm = this.builder.group({
    continent : "",
  })
}

/* myValueFormatter(data: any): string {
  return `(${data[data.id]}) ${data[data.name]}`;
} */
/* @ViewChild('autocomp')el:ElementRef
prepareContaint(e){
  this.continents = [];
  console.log(this.el);
 
 // console.log(this.continents);
} */

autocompleListFormatter = (data: any) : SafeHtml => {
  let html = `<span>${data.sortname +" "+ data.name}</span>`;
  return this._sanitizer.bypassSecurityTrustHtml(html);
}

onSubmit(value:any){
  console.log(value);
}
 
}