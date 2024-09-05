import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamasMantenimientoComponent } from './camas-mantenimiento.component';

describe('CamasMantenimientoComponent', () => {
  let component: CamasMantenimientoComponent;
  let fixture: ComponentFixture<CamasMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamasMantenimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CamasMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
