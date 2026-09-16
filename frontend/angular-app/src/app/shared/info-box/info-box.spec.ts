import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoBox } from './info-box';

describe('InfoBox', () => {
  let component: InfoBox;
  let fixture: ComponentFixture<InfoBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoBox],
    }).compileComponents();

    fixture = TestBed.createComponent(InfoBox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('oculta la explicación por defecto', () => {
    fixture.componentRef.setInput('contenido', 'Explicación de prueba');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain('Explicación de prueba');
  });

  it('muestra la explicación al alternar', () => {
    fixture.componentRef.setInput('contenido', 'Explicación de prueba');
    fixture.detectChanges();
    const boton = fixture.nativeElement.querySelector('button');
    boton.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Explicación de prueba');
  });
});