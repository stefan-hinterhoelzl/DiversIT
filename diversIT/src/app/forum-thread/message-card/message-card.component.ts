import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { serverTimestamp } from 'firebase/firestore';
import { take } from 'rxjs/operators';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { Answer } from 'src/app/models/forum.model';
import { ForumService } from 'src/app/services/forum.service';
import { SnackbarComponent } from 'src/app/snackbar/snackbar.component';

@Component({
  selector: 'app-message-card',
  templateUrl: './message-card.component.html',
  styleUrls: ['./message-card.component.scss']
})
export class MessageCardComponent implements OnInit {

  @Input() title: string;
  @Input() content: string;
  @Input() timestamp: string;
  @Input() number: number;


  constructor(private dialog: MatDialog, private forum: ForumService, private route: ActivatedRoute, private router: Router, private snackbar: SnackbarComponent) { }

  ngOnInit(): void {
  }

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


  copyToClipboard(){
    navigator.clipboard.writeText(this.router.url);
    this.snackbar.openSnackBar("URL in die Zwischenablage kopiert!", "green-snackbar")
  }
}
