import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfertaComponent } from './oferta.component';


const routes:Routes=[
    {path:'',component:OfertaComponent}
];
@NgModule({
imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfertaRoutingModule{}