import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiberarCamaComponent } from './liberar-cama.component';

describe('LiberarCamaComponent', () => {
  let component: LiberarCamaComponent;
  let fixture: ComponentFixture<LiberarCamaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiberarCamaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiberarCamaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
