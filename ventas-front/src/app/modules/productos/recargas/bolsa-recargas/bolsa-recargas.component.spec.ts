import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BolsaRecargasComponent } from './bolsa-recargas.component';

describe('BolsaRecargasComponent', () => {
  let component: BolsaRecargasComponent;
  let fixture: ComponentFixture<BolsaRecargasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BolsaRecargasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BolsaRecargasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
