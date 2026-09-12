import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Segmentacion } from './segmentacion';

describe('Segmentacion', () => {
  let component: Segmentacion;
  let fixture: ComponentFixture<Segmentacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Segmentacion],
    }).compileComponents();

    fixture = TestBed.createComponent(Segmentacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
