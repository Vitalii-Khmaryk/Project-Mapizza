import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthorizationRoutingModule} from "./authorization-routing.module";
import {SharedModule} from "../../shared/shared.module";
import {AuthorizationComponent} from "./authorization.component";



@NgModule({
  declarations: [
    AuthorizationComponent
  ],
  imports: [
    CommonModule,
    AuthorizationRoutingModule,
    SharedModule
  ]
})
export class AuthorizationModule { }