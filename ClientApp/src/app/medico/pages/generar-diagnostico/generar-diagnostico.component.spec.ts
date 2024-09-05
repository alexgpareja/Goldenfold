import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarDiagnosticoComponent } from './generar-diagnostico.component';

describe('GenerarDiagnosticoComponent', () => {
  let component: GenerarDiagnosticoComponent;
  let fixture: ComponentFixture<GenerarDiagnosticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenerarDiagnosticoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerarDiagnosticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
