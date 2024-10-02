import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackBarNotiComponent } from './snack-bar-noti.component';

describe('SnackBarNotiComponent', () => {
  let component: SnackBarNotiComponent;
  let fixture: ComponentFixture<SnackBarNotiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SnackBarNotiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnackBarNotiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
