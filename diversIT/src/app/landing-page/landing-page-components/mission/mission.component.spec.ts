import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionComponent } from './mission.component';

describe('MissionComponent', () => {
  let component: MissionComponent;
  let fixture: ComponentFixture<MissionComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MissionComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should render title 'Die DiversIT-Mission'`, () => {
    expect(compiled.querySelector('h2').textContent).toBe('Die DiversIT-Mission');
  });

  it(`should render '6' h3 items`, () => {
    expect(compiled.querySelectorAll('h3')).toHaveSize(6);
  });
});
