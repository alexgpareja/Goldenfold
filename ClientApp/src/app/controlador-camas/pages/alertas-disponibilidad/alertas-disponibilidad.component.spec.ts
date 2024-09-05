import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertasDisponibilidadComponent } from './alertas-disponibilidad.component';

describe('AlertasDisponibilidadComponent', () => {
  let component: AlertasDisponibilidadComponent;
  let fixture: ComponentFixture<AlertasDisponibilidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlertasDisponibilidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertasDisponibilidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
