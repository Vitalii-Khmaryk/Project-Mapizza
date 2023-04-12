import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FavoriteComponent } from './favorite.component';


const routes:Routes=[
    {path:'',component:FavoriteComponent}
];
@NgModule({
imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FavoriteRoutingModule{}