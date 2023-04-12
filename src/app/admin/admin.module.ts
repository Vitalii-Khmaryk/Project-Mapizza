import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AdminRoutingModule} from "./admin-routing.module";
import {AdminComponent} from "./admin.component";


import {AdminCategoryComponent} from "./admin-category/admin-category.component";
import {AdminOrderComponent} from "./admin-order/admin-order.component";
import {AdminProductComponent} from "./admin-product/admin-product.component";
import {AdminDiscountComponent} from "./admin-discount/admin-discount.component";

import { SharedModule } from '../shared/shared.module';
@NgModule({
  declarations: [
    AdminComponent,
    AdminCategoryComponent,
    AdminOrderComponent,
    AdminProductComponent,
    AdminDiscountComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
 
  ]
})
export class AdminModule { }