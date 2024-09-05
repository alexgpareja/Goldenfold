import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialMovimientosCamasComponent } from './historial-movimientos-camas.component';

describe('HistorialMovimientosCamasComponent', () => {
  let component: HistorialMovimientosCamasComponent;
  let fixture: ComponentFixture<HistorialMovimientosCamasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistorialMovimientosCamasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialMovimientosCamasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
