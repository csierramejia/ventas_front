import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChanceMillonarioComponent } from './chance-millonario.component';

describe('ChanceMillonarioComponent', () => {
  let component: ChanceMillonarioComponent;
  let fixture: ComponentFixture<ChanceMillonarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChanceMillonarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChanceMillonarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
