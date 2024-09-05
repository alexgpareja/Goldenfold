import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitarConsultaComponent } from './solicitar-consulta.component';

describe('SolicitarConsultaComponent', () => {
  let component: SolicitarConsultaComponent;
  let fixture: ComponentFixture<SolicitarConsultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolicitarConsultaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitarConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
