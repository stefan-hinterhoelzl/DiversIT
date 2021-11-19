import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftSpacerComponent } from './left-spacer.component';

describe('LeftSpacerComponent', () => {
  let component: LeftSpacerComponent;
  let fixture: ComponentFixture<LeftSpacerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeftSpacerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftSpacerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
