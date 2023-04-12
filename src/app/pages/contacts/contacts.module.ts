import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsRoutingModule } from './contacts-routing.module';
import { ContactsComponent } from './contacts.component';
import { ReactiveFormsModule } from '@angular/forms';
 
@NgModule({
    declarations:[
    ContactsComponent
],
imports:[
    CommonModule,
    ContactsRoutingModule,
    ReactiveFormsModule
]
})
export class ContactsModule{}