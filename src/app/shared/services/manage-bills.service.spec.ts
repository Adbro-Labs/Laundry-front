import { TestBed } from '@angular/core/testing';

import { ManageBillsService } from './manage-bills.service';

describe('ManageBillsService', () => {
  let service: ManageBillsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageBillsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
