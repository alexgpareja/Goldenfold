import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionNotificacionesGlobalesComponent } from './gestion-notificaciones-globales.component';

describe('GestionNotificacionesGlobalesComponent', () => {
  let component: GestionNotificacionesGlobalesComponent;
  let fixture: ComponentFixture<GestionNotificacionesGlobalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestionNotificacionesGlobalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionNotificacionesGlobalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
