import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiscountComponent } from './discount.component';
import { DiscountInfoComponent } from './discount-info/discount-info.component';
import { DiscountService } from 'src/app/shared/services/discount/discount.service';
const routes:Routes=[
    {path:'',component:DiscountComponent},
    {path: ':id', component: DiscountInfoComponent,resolve:{
      actionsInfo:DiscountService
  }}
];
@NgModule({
imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscountRoutingModule{}