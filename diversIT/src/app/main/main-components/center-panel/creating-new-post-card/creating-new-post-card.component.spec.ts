import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatingNewPostCardComponent } from './creating-new-post-card.component';

describe('CreatingNewPostCardComponent', () => {
  let component: CreatingNewPostCardComponent;
  let fixture: ComponentFixture<CreatingNewPostCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatingNewPostCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatingNewPostCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
