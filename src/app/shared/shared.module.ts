import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FilterPipe } from './pipes/filter/filter.pipe';

const MATERIAL = [MatDialogModule, MatInputModule];

@NgModule({
  declarations: [FilterPipe],
  imports: [...MATERIAL, FormsModule, ReactiveFormsModule],
  exports: [...MATERIAL, FormsModule, ReactiveFormsModule, FilterPipe],
})
export class SharedModule {}
