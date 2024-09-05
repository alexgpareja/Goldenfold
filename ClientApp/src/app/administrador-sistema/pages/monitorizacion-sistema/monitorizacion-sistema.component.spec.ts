import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorizacionSistemaComponent } from './monitorizacion-sistema.component';

describe('MonitorizacionSistemaComponent', () => {
  let component: MonitorizacionSistemaComponent;
  let fixture: ComponentFixture<MonitorizacionSistemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonitorizacionSistemaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitorizacionSistemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
