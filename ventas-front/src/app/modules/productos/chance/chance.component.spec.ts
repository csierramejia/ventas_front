import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChanceComponent } from './chance.component';

describe('ChanceComponent', () => {
  let component: ChanceComponent;
  let fixture: ComponentFixture<ChanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
