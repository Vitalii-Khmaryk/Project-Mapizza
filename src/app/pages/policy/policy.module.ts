import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PolicyRoutingModule } from './policy-routing.module';
import { PolicyComponent } from './policy.component';

 
@NgModule({
    declarations:[
    PolicyComponent
],
imports:[
    PolicyRoutingModule,
    CommonModule
]
})
export class PolicyModule{}