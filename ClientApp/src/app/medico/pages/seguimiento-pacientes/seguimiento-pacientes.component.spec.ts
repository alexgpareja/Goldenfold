import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoPacientesComponent } from './seguimiento-pacientes.component';

describe('SeguimientoPacientesComponent', () => {
  let component: SeguimientoPacientesComponent;
  let fixture: ComponentFixture<SeguimientoPacientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeguimientoPacientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguimientoPacientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
