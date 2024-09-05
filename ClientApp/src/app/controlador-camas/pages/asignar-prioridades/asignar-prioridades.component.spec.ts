import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarPrioridadesComponent } from './asignar-prioridades.component';

describe('AsignarPrioridadesComponent', () => {
  let component: AsignarPrioridadesComponent;
  let fixture: ComponentFixture<AsignarPrioridadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AsignarPrioridadesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignarPrioridadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
