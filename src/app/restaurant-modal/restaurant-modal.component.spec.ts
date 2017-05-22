import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantModalComponent } from './restaurant-modal.component';

describe('RestaurantModalComponent', () => {
  let component: RestaurantModalComponent;
  let fixture: ComponentFixture<RestaurantModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurantModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
