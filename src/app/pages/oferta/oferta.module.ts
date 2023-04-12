import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfertaRoutingModule } from './oferta-routing.module';
import { OfertaComponent } from './oferta.component';

 
@NgModule({
    declarations:[
    OfertaComponent
],
imports:[
    CommonModule,
    OfertaRoutingModule
]
})
export class OfertaModule{}