import { TestBed } from '@angular/core/testing';

import { AuthBehaviorService } from './auth-behavior.service';

describe('AuthBehaviorService', () => {
  let service: AuthBehaviorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthBehaviorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
