import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { AfterViewInit, ChangeDetectorRef, Component, ContentChild, ElementRef, HostListener, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
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
          if (this.currentChats != null) {
            this.initialize(this.currentUser);
          }
        })
      }
    });
  }

  initialize(user: DiversITUser) {

  }

  async openChat(chat: Chat) {
    if (this.chatunsub != null) {
      await this.firestore.closeChat(this.activeChat);
      this.chatunsub();
    } 
    this.chatunsub = this.firestore.activateMessageListener(chat)
    this.messageSubscription = this.firestore.messagesStatus.subscribe(async (data) => {
      this.messages = data;
      if (data != null) {
        this.chatOpen = true;
        setTimeout(()=> this.scrollToBottom(), 0)
      }
    });
    await this.firestore.openChat(chat);
    this.activeChat = chat;
    this.activeChatUID = chat.uid
    if (this.input != undefined) this.input.nativeElement.focus();

  }


  sendMessage() {
    let trimmed = this.textInput.value.trim();
    if (trimmed != "") {
      this.firestore.sendMessage(this.activeChat, trimmed , this.currentUser)
    }
    this.textInput.setValue("");
  }

  onKeydown(event) {
    if (event.key === "Enter") {
      event.preventDefault()
      console.log(this.textInput.value)
      this.sendMessage();
    }
  }

  scrollToBottom() {
    this.myList.nativeElement.scrollTop = this.myList.nativeElement.scrollHeight - this.myList.nativeElement.clientHeight
  }

  @HostListener('window:beforeunload', ['$event'])
  async beforeUnloadHandler(event) {
    await this.firestore.closeChat(this.activeChat);
    this.chatunsub();
  }

}

