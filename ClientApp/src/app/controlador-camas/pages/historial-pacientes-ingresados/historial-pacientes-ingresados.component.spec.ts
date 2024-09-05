import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialPacientesIngresadosComponent } from './historial-pacientes-ingresados.component';

describe('HistorialPacientesIngresadosComponent', () => {
  let component: HistorialPacientesIngresadosComponent;
  let fixture: ComponentFixture<HistorialPacientesIngresadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistorialPacientesIngresadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialPacientesIngresadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
