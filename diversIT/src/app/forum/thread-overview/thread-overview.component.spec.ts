import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ThreadOverviewComponent } from './thread-overview.component';
import { ForumServiceStub } from 'src/app/services/forum.service.mock';
import { ForumService } from 'src/app/services/forum.service';

describe('ThreadOverviewComponent', () => {
  let component: ThreadOverviewComponent;
  let fixture: ComponentFixture<ThreadOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThreadOverviewComponent],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: ForumService, useClass: ForumServiceStub }
      ],
      imports: [RouterTestingModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreadOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
