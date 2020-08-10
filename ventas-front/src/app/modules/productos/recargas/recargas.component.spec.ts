import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecargasComponent } from './recargas.component';

describe('RecargasComponent', () => {
  let component: RecargasComponent;
  let fixture: ComponentFixture<RecargasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecargasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecargasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
