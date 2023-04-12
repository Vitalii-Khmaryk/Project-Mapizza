import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-order',
  templateUrl: './admin-order.component.html',
  styleUrls: ['./admin-order.component.scss']
})
export class AdminOrderComponent {
  public orderAdmin!:any[];
ngOnInit(): void {
  this.loadOrder();
}

loadOrder(){
  let ordersArray = JSON.parse(localStorage.getItem('orders') as string);
  if (!ordersArray) {
    return;
  } else {
    this.orderAdmin=ordersArray;
  }
}

}
