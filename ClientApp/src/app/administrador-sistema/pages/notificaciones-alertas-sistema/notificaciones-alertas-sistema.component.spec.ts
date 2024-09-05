import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionesAlertasSistemaComponent } from './notificaciones-alertas-sistema.component';

describe('NotificacionesAlertasSistemaComponent', () => {
  let component: NotificacionesAlertasSistemaComponent;
  let fixture: ComponentFixture<NotificacionesAlertasSistemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificacionesAlertasSistemaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificacionesAlertasSistemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
