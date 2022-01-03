import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightPanelProfileComponent } from './right-panel.component';

describe('RightPanelComponent of Profile-Page', () => {
  let component: RightPanelProfileComponent;
  let fixture: ComponentFixture<RightPanelProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RightPanelProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RightPanelProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
