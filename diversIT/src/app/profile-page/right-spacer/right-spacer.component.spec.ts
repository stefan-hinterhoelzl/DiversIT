import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightSpacerComponent } from './right-spacer.component';

describe('RightSpacerComponent', () => {
  let component: RightSpacerComponent;
  let fixture: ComponentFixture<RightSpacerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RightSpacerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RightSpacerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
