import { TestBed } from '@angular/core/testing';

import { HistorialAltaService } from './historial-alta.service';

describe('HistorialAltaService', () => {
  let service: HistorialAltaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistorialAltaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
