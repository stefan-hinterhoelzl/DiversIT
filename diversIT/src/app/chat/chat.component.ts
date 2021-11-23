import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { AfterViewInit, ChangeDetectorRef, Component, ContentChild, ElementRef, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AngularMaterialModule } from '../angular-material-module';
import { Chat, Message } from '../models/chat.model';
import { DiversITUser } from '../models/users.model';
import { FirestoreService } from '../services/firestore.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  currentUser: DiversITUser
  currentUserSubscription: Subscription
  currentChats: Chat[]
  currentChatsSubscription: Subscription

  
  messageSubscription: Subscription;
  messages: Message[];

  
  chatOpen: boolean = false;
  activeChat: Chat;
  activeChatUID: string = "";

  chatunsub

  textInput: FormControl

  @ViewChild('myInput') input: ElementRef;
  @ViewChild('messageList') myList: ElementRef;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  constructor(private firestore: FirestoreService, private _ngZone: NgZone) {
    this.textInput = new FormControl('', Validators.required);
   }

   triggerResize() {
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  ngOnInit(): void {
    this.currentUserSubscription = this.firestore.currentUserStatus.subscribe((data) => {
      if(data !== null) {
        this.currentUser = data;
        this.currentChatsSubscription = this.firestore.chatStatus.subscribe((data) => {
          this.currentChats = data;
          console.log(data)
          if (this.currentChats != null) {
            this.initialize(this.currentUser);
          }
        })
      }
    });
  }

  initialize(user: DiversITUser) {

  }

  openChat(chat: Chat) {
    if (this.chatunsub != null) this.chatunsub();
    this.chatunsub = this.firestore.activateMessageListener(chat)
    this.messageSubscription = this.firestore.messagesStatus.subscribe((data) => {
      this.messages = data;
      if (data != null) {
        this.firestore.openChat(chat);
        this.chatOpen = true;
        if (this.input != undefined) this.input.nativeElement.focus();
        setTimeout(()=> this.scrollToBottom(), 0)
        this.activeChat = chat;
        this.activeChatUID = chat.uid
      }
    });

  }


  sendMessage() {
    let trimmed = this.textInput.value.trim();
    if (trimmed != "") {
      this.firestore.sendMessage(this.activeChat, trimmed , this.currentUser)
    }
    this.textInput.reset();
  }

  onKeydown(event) {
    if (event.key === "Enter") {
      this.sendMessage();
    }
  }

  scrollToBottom() {
    console.log(this.myList.nativeElement.scrollHeight + " + " + this.myList.nativeElement.clientHeight)
    this.myList.nativeElement.scrollTop = this.myList.nativeElement.scrollHeight - this.myList.nativeElement.clientHeight
  }

}

