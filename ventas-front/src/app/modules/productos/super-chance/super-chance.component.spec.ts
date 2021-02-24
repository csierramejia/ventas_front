import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperChanceComponent } from './super-chance.component';

describe('SuperChanceComponent', () => {
  let component: SuperChanceComponent;
  let fixture: ComponentFixture<SuperChanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperChanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperChanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
