import { element } from 'protractor';
import { ElectronService } from 'ngx-electron';
import { DomSanitizer,SafeHtml } from '@angular/platform-browser'
import { Component, OnInit, ViewChild, ElementRef, Renderer,Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, NgModel, NgForm } from '@angular/forms';
import { NgAutocompleteComponent, CreateNewAutocompleteGroup, SelectedAutocompleteItem} from 'ng-auto-complete'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private builder: FormBuilder, private _sanitizer: DomSanitizer,
    private _electronService:ElectronService,private element:ElementRef,private renderer:Renderer) {}
 
  form;
  order;
  initProduct = [];
  item_id:number;

  @ViewChild("calculationForm")
  public cal_form:NgForm;
  total_quantity:number=0;
  gtotla_price:number=0;
  discount_per:number=0;
  discount_rs:number=0;
  total_discount:number=0;
  container_charge:number=0;
  delivery_charge:number=0;
  total_aditional:number=0;
  customer_paid:number=0;
  return_amount:number=0;
  
  ngOnInit() {
    this.form = new FormGroup({
      type:new FormControl(""),
      table_no:new FormControl(""),
      mobile:new FormControl(""),
      name:new FormControl(""),
      address:new FormControl(""),
      address2:new FormControl(""),
      item_id:new FormControl(""),
      item:new FormControl(""),
      comment:new FormControl(""),
      quantity:new FormControl(""),
      price:new FormControl(""),
      total_price:new FormControl("")
    });
    this.getCurrentOrder('');
    this.getTotalPriceAndQuantity('');
    this.prepareDataForDropDown();
  }
  
 /* ===========================================OnSubmit Actions=============================================== */

   onSubmit = function(order,e){
    let code = e.keyCode || e.which;
    console.log(this.form.valid);
    if(!this.form.valid){
      return false;
    }
    if(code==13){
     e.preventDefault();
     let data = this._electronService.ipcRenderer.sendSync('saveOrder',order);
     this.changeFoculeToDefault();
     this.clearDataFromDisplay(order);
     this.getCurrentOrder(order.table_no);
     this.getTotalPriceAndQuantity(order.table_no);
    }
   }

/* ===========================================Delete Data Actions=============================================== */
  deleteData = function(id,table_no){
    let data = this._electronService.ipcRenderer.sendSync('deleteCurrentTableOrder',id);
    console.log(data);
    this.getCurrentOrder(table_no);
    this.getTotalPriceAndQuantity(table_no);
  }
/* ================================================Retrive Data From Database Table =============================*/

  getCurrentOrder(table_no){
    console.log(table_no);
    let data = this._electronService.ipcRenderer.sendSync('getOrderAccTable',table_no);
    console.log(data);
    this.order = data;
  }

  getTotalPriceAndQuantity(table_no){
    let data = this._electronService.ipcRenderer.sendSync('totalPriceNdQuantity',table_no);
    console.log(data);
    this.total_quantity = data[0].tquantity;
    this.gtotla_price = data[0].gtprice;
    this.total_discount = this.gtotla_price;
    this.total_aditional = this.gtotla_price;
  }
  round(val){
    return Math.round(val);
  }
/* ========================================Calculate final amount Events=============================================== */
  calculateDiscPer = function(value){
    this.discount_per = (this.gtotla_price * value)/100;
    /* console.log(this.gtotla_price-(this.discount_per+this.discount_rs)); */
    this.total_discount = this.round(this.gtotla_price-(this.discount_per+this.discount_rs));
    this.total_aditional =  this.round(this.total_discount+this.container_charge+this.delivery_charge);
  }

  calculateDiscRs = function(value){
    this.discount_rs = value;
    this.total_discount =  this.round(this.gtotla_price-(this.discount_per+this.discount_rs)); 
    this.total_aditional =  this.round(this.total_discount+this.container_charge+this.delivery_charge);
  }

  calculateContaiCharge(value){
    this.container_charge = value;
    this.total_aditional =  this.round(this.total_discount+this.container_charge+this.delivery_charge);
  }

  calculateDelivCharge(value){
    this.delivery_charge = value;
    this.total_aditional =  this.round(this.total_discount+this.container_charge+this.delivery_charge);
  }

  calculateReturn(value){
    this.customer_paid = value;
    this.return_amount = this.customer_paid - this.total_aditional;
  }
/* ========================================Events on type and table no=============================================== */

  dineInSelect = function(e){
    console.log(this.form);
    this.enableTable();
    this.changeFoculeOnTable();
    this.formSetupForDineIn();
  }

  takeawaySelect = function(e){
    console.log(this.form);
    this.focusOnDetails();
    this.disableTable();
    this.formSetupForOtherOrder();
  }

  deliverySelect = function(e){
    console.log(this.form.value);
    this.focusOnDetails();
    this.disableTable();
    this.formSetupForOtherOrder();
  }

  tableSelected = function(e){
    let code = e.keyCode || e.which;
    if(code==13)
    this.changeFoculeToDefault()
  }

  gotoItems = function(e){
    let code = e.keyCode || e.which;
    if(code==13)
    this.changeFoculeToDefault()
  }

  calculatePriceAccQuant = function(quantity){
    let price = this.form.value.price;
    this.form.get('total_price').setValue(price*quantity);
  }

  changeFoTOPrice = function(e){
    let price = this.form.value.item.price;
    console.log(this.form.value.item.id);
    let quantity = 1;
    let code = e.keyCode || e.which;
    if(code==13){
      /* this.form.get('type').setValue(this.form.value.type);
      this.form.get('mobile').setValue(this.form.value.mobile);
      this.form.get('name').setValue(this.form.value.name);
      this.form.get('address').setValue(this.form.value.address);
      this.form.get('address2').setValue(this.form.value.address2); */
      this.form.get('item_id').setValue(this.form.value.item.id);
      this.form.get('item').setValue(this.form.value.item.name);
      this.form.get('comment').setValue(this.form.value.comment);
      this.form.get('quantity').setValue(quantity);
      this.form.get('price').setValue(price);
      this.form.get('total_price').setValue(price*quantity);

    this.itemINP.nativeElement.parentNode.parentNode.nextElementSibling.children[0].focus();
  }
  }

/* =======================================DomElements================================================= */
  @ViewChild('table') tableER:ElementRef
  @ViewChild('itemFocus') itemINP:ElementRef

/* ===========================================Change Focus Acc to Type and Submition========================== */
  
   changeFoculeOnTable(){
    this.tableER.nativeElement.focus();
   }

   disableTable(){
    this.renderer.setElementAttribute(this.tableER.nativeElement,'disabled','true');
   }
   enableTable(){
    this.renderer.setElementAttribute(this.tableER.nativeElement,'disabled',null);
   }

   focusOnDetails(){
    this.tableER.nativeElement.parentNode.parentNode.nextElementSibling.children[0].children[0].focus();
   }
  
   changeFoculeToDefault(){
      this.itemINP.nativeElement.focus();
   }
/* =======================================Clear data From Display===================================== */

  clearDataFromDisplay(data){
    this.form.get('type').setValue(data.type);
    this.form.get('table_no').setValue(data.table_no);
    this.form.get('mobile').setValue(data.mobile);
    this.form.get('name').setValue(data.name);
    this.form.get('address').setValue(data.address);
    this.form.get('address2').setValue(data.address2);
    this.form.get('item').setValue('');
    this.form.get('comment').setValue('');
    this.form.get('quantity').setValue('');
    this.form.get('price').setValue('');
    this.form.get('total_price').setValue('');
    // console.log(this.form);
   }

/* =======================================Clear data From Display===================================== */
formSetupForDineIn(){
  console.log(this.form);
  this.form.controls.table_no.status = "INVALID";
}

formSetupForOtherOrder(){
  this.form.get('table_no').setValue('');
  /* this.form.controls.table_no.value = '';
  this.tableER.nativeElement.value = ''; */
  this.form.controls.table_no.status = "VALID";
}


/* ==========================================AutoComplete================================================== */

autocompleListFormatter = (data: any) : SafeHtml => {
  let html = `<span>${data.sortname +" "+ data.name}</span>`;
  return this._sanitizer.bypassSecurityTrustHtml(html);
}

/* autocompleListFormatter = (data)  => {
  return `<span>${data.sortname +" "+ data.name}</span>`;
}
 */
prepareDataForDropDown(){
  this.initProduct = [];
  let data = this._electronService.ipcRenderer.sendSync('searchProduct',"kk");
  data.forEach(element => {
    this.item_id = element.id;
  this.initProduct.push({
                  'id':element.id,
                  'sortname':element.sortname,
                  'name':element.item,
                  'price':element.price
                  });
  });
}

}