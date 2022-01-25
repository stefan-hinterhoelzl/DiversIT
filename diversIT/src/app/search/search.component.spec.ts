import { ObserversServiceStub } from './../services/observers.service.mock';
import { LoadingService } from './../services/loading.service';
import { UserServiceStub } from './../services/user.service.mock';
import { UserService } from './../services/user.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { ObserversService } from '../services/observers.service';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchComponent],
      providers: [
        { provide: UserService, useClass: UserServiceStub },
        { provide: LoadingService, useValue: {} },
        { provide: ObserversService, useClass: ObserversServiceStub }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
