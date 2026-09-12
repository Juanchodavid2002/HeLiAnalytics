import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Causas } from './causas';

describe('Causas', () => {
  let component: Causas;
  let fixture: ComponentFixture<Causas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Causas],
    }).compileComponents();

    fixture = TestBed.createComponent(Causas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
