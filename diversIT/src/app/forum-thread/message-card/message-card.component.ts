import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { serverTimestamp } from 'firebase/firestore';
import { take } from 'rxjs/operators';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { Answer } from 'src/app/models/forum.model';
import { ForumService } from 'src/app/services/forum.service';
import { SnackbarComponent } from 'src/app/snackbar/snackbar.component';


/**
 * a single message of a thread
 *
 * @export
 * @class MessageCardComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-message-card',
  templateUrl: './message-card.component.html',
  styleUrls: ['./message-card.component.scss']
})
export class MessageCardComponent {

  @Input() title: string;
  @Input() content: string;
  @Input() timestamp: string;
  @Input() number: number;


  /**
   * Creates an instance of MessageCardComponent.
   * @param {MatDialog} dialog uses dialoge to answer to a question
   * @param {ForumService} forum service to add/get content
   * @param {ActivatedRoute} route allows to read the parameters in the route
   * @param {Router} router allows to redirect the user to a different page
   * @param {SnackbarComponent} snackbar can be used to inform the user about certain circumstances
   * @memberof MessageCardComponent
   */
  constructor(private dialog: MatDialog, private forum: ForumService, private route: ActivatedRoute, private router: Router, private snackbar: SnackbarComponent) { }


  /**
   *  opens a dialoge to answer a question
   *
   * @memberof MessageCardComponent
   */
  openDialogeToAnswer(){
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "40%",
      data: {
        header: "Schreibe deine Antwort",
        placeholderForInputArea: "Schreibe etwas...",
        buttonTextConfirm: "Antworten",
        buttonTextAbort: "Abbrechen",
      },
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result != null) {
        // add answer
        this.forum.createAnswer(<Answer>{
          text: result.inputAreaValue,
          timestamp: serverTimestamp(),
          threadUID: this.route.snapshot.paramMap.get('id'),
        }).then((data) => {
          // wird noch schöner mit nem output gelöst, aber ist vorerst mal eine schnelle lösung
          window.location.reload()
        })               
      }
    });
  }

  
  /**
   *  copies the url to clipboard, this can be used to share a forums thread
   *
   * @memberof MessageCardComponent
   */
  copyToClipboard(){
    navigator.clipboard.writeText(this.router.url);
    this.snackbar.openSnackBar("URL in die Zwischenablage kopiert!", "green-snackbar")
  }
}
