import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarInformacionPacienteComponent } from './actualizar-informacion-paciente.component';

describe('ActualizarInformacionPacienteComponent', () => {
  let component: ActualizarInformacionPacienteComponent;
  let fixture: ComponentFixture<ActualizarInformacionPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActualizarInformacionPacienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualizarInformacionPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
