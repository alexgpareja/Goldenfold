import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitarPruebasMedicasComponent } from './solicitar-pruebas-medicas.component';

describe('SolicitarPruebasMedicasComponent', () => {
  let component: SolicitarPruebasMedicasComponent;
  let fixture: ComponentFixture<SolicitarPruebasMedicasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolicitarPruebasMedicasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitarPruebasMedicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
