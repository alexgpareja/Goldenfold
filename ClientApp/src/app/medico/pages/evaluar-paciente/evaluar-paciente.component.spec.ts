import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluarPacienteComponent } from './evaluar-paciente.component';

describe('EvaluarPacienteComponent', () => {
  let component: EvaluarPacienteComponent;
  let fixture: ComponentFixture<EvaluarPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvaluarPacienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluarPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
