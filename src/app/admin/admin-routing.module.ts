import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdminComponent} from "./admin.component";
import {AdminCategoryComponent} from "./admin-category/admin-category.component";
import {AdminOrderComponent} from "./admin-order/admin-order.component";
import {AdminProductComponent} from "./admin-product/admin-product.component";
import {AdminDiscountComponent} from "./admin-discount/admin-discount.component";

const routes: Routes = [
  {path:'',component:AdminComponent,children:[
      {path: 'category', component: AdminCategoryComponent},
      {path: 'order', component: AdminOrderComponent},
      {path: 'product', component: AdminProductComponent},
      {path: 'discount', component: AdminDiscountComponent},
      {path: '', pathMatch: 'full', redirectTo: 'discount'}
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }