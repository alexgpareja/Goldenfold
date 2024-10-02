import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedRoutingModule } from './shared-routing.module';
import { SearchBoxComponent } from './search-box/search-box.component';
import { SnackBarNotiComponent } from './snack-bar-noti/snack-bar-noti.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  imports: [
    MatSnackBarModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedRoutingModule,
  ],
  declarations: [SearchBoxComponent, SnackBarNotiComponent],
  exports: [CommonModule, SearchBoxComponent],
  
})
export class SharedModule { }
