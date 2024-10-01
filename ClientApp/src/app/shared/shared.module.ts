import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedRoutingModule } from './shared-routing.module';
import { SearchBoxComponent } from './search-box/search-box.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedRoutingModule,
  ],
  declarations: [SearchBoxComponent],
  exports: [CommonModule, SearchBoxComponent]
})
export class SharedModule { }
