import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryRoutingModule } from './delivery-routing.module';
import { DeliveryComponent } from './delivery.component';

 
@NgModule({
    declarations:[
    DeliveryComponent
],
imports:[
    CommonModule,
    DeliveryRoutingModule
]
})
export class DeliveryModule{}