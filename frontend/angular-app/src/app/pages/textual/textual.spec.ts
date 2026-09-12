import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaTextual } from './textual';

describe('PaginaTextual', () => {
  let component: PaginaTextual;
  let fixture: ComponentFixture<PaginaTextual>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaTextual],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaTextual);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

