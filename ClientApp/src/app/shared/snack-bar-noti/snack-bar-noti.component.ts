import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snack-bar-noti',
  templateUrl: './snack-bar-noti.component.html',
  styleUrls: ['./snack-bar-noti.component.css']
})
export class SnackBarNotiComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { message: string, panelClass: string, icon: string }) {}
}
