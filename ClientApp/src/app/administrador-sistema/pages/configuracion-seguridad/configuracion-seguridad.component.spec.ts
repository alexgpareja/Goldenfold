import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionSeguridadComponent } from './configuracion-seguridad.component';

describe('ConfiguracionSeguridadComponent', () => {
  let component: ConfiguracionSeguridadComponent;
  let fixture: ComponentFixture<ConfiguracionSeguridadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfiguracionSeguridadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfiguracionSeguridadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
