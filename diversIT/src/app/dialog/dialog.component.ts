import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dialog } from '../models/dialog.model';

/**
 * Template Dialog/Modal. Cann be used throughout the page without reinventing the dialog implementation.
 *
 * @export
 * @class DialogComponent
 */
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {


  /**
   * Creates an instance of DialogComponent. 
   * 
   * Each value of data can be left out, if it is deemed unnecessary.
   * 
   * @example this.dialog.open(DialogComponent, {
      width: "30%",
      data: {
        header: "Mentorenschaft beantragen",
        text: "Schreibe ein paar Worte über dich, damit dein Mentor dich direkt kennenlernt.",
        placeholderForInputArea: "Platzhalter Textarea",
        inputAreaValue: "Inhalt der Textarea",
        placeholderForInput: "Platzhalter Textfield",
        inputValue: "Hallo Welt!",
        buttonTextConfirm: "Anfrage senden",
        buttonTextAbort: "Abbrechen",
      },
    })
   * @param {MatDialogRef<DialogComponent>} dialogRef
   * @param {Dialog} data
   * @memberof DialogComponent
   */
  constructor(public dialogRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Dialog,) { }


  /**
   * closes the Dialoge and does not return data.
   *
   * @memberof DialogComponent
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

}
