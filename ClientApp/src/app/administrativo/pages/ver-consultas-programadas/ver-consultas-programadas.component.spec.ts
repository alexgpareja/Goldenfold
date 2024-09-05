import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerConsultasProgramadasComponent } from './ver-consultas-programadas.component';

describe('VerConsultasProgramadasComponent', () => {
  let component: VerConsultasProgramadasComponent;
  let fixture: ComponentFixture<VerConsultasProgramadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerConsultasProgramadasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerConsultasProgramadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
