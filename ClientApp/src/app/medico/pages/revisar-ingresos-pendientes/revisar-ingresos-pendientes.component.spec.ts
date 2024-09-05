import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisarIngresosPendientesComponent } from './revisar-ingresos-pendientes.component';

describe('RevisarIngresosPendientesComponent', () => {
  let component: RevisarIngresosPendientesComponent;
  let fixture: ComponentFixture<RevisarIngresosPendientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RevisarIngresosPendientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevisarIngresosPendientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
