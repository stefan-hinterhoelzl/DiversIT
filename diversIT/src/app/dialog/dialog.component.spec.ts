import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { DialogComponent } from './dialog.component';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

  class MockMatDialogRef{

  }

  const data = {
    header: "überschrift",
    text: "Text und Inhalt",
    placeholderForInputArea: "Platzhalter für Textarea",
    inputAreaValue: "Text in Textarea",
    placeholderForInput: "Platzhalter Input",
    inputValue: "inputValue",
    buttonTextConfirm: "Confirm",
    buttonTextAbort: "Abort"
  }


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogComponent ],
      providers: [
        {provide: MatDialogRef, useClass: MockMatDialogRef},
        {provide: MAT_DIALOG_DATA, useValue: data},
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
