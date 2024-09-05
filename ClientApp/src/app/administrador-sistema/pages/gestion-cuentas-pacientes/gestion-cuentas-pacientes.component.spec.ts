import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCuentasPacientesComponent } from './gestion-cuentas-pacientes.component';

describe('GestionCuentasPacientesComponent', () => {
  let component: GestionCuentasPacientesComponent;
  let fixture: ComponentFixture<GestionCuentasPacientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestionCuentasPacientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionCuentasPacientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
