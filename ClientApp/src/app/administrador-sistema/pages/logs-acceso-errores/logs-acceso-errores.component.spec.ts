import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsAccesoErroresComponent } from './logs-acceso-errores.component';

describe('LogsAccesoErroresComponent', () => {
  let component: LogsAccesoErroresComponent;
  let fixture: ComponentFixture<LogsAccesoErroresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogsAccesoErroresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogsAccesoErroresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
