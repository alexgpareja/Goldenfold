import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerResultadosPruebasComponent } from './ver-resultados-pruebas.component';

describe('VerResultadosPruebasComponent', () => {
  let component: VerResultadosPruebasComponent;
  let fixture: ComponentFixture<VerResultadosPruebasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerResultadosPruebasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerResultadosPruebasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
