import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ambito } from './ambito';

describe('Ambito', () => {
  let component: Ambito;
  let fixture: ComponentFixture<Ambito>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ambito],
    }).compileComponents();

    fixture = TestBed.createComponent(Ambito);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});