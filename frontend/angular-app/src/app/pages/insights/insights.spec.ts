import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaInsights } from './insights';

describe('PaginaInsights', () => {
  let component: PaginaInsights;
  let fixture: ComponentFixture<PaginaInsights>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaInsights],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaInsights);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

