import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitarIngresoComponent } from './solicitar-ingreso.component';

describe('SolicitarIngresoComponent', () => {
  let component: SolicitarIngresoComponent;
  let fixture: ComponentFixture<SolicitarIngresoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolicitarIngresoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitarIngresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
