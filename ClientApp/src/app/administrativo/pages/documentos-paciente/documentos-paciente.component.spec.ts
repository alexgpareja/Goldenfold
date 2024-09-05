import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentosPacienteComponent } from './documentos-paciente.component';

describe('DocumentosPacienteComponent', () => {
  let component: DocumentosPacienteComponent;
  let fixture: ComponentFixture<DocumentosPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentosPacienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentosPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
