import { ChangeDetectorRef, Component, ContentChild, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AngularMaterialModule } from '../angular-material-module';
import { Chat, Message } from '../models/chat.model';
import { DiversITUser } from '../models/users.model';
import { FirestoreService } from '../services/firestore.service';

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
  activeChat: string;

  chatunsub

  textInput: FormControl

  @ViewChild('myInput') input: ElementRef;

  constructor(private firestore: FirestoreService, private cd: ChangeDetectorRef) {
    this.textInput = new FormControl('', Validators.required);
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

  openChat(chat: Chat) {
    if (this.chatunsub != null) this.chatunsub();
    this.chatunsub = this.firestore.activateMessageListener(chat.uid)
    this.messageSubscription = this.firestore.messagesStatus.subscribe((data) => {
      this.messages = data;
      console.log(data);
    });
    this.chatOpen = true;
    if (this.input != undefined) this.input.nativeElement.focus();
    this.activeChat = chat.uid;

  }


  sendMessage() {
    let trimmed = this.textInput.value.trim();
    if (trimmed != "") {
      this.firestore.sendMessage(this.activeChat, trimmed , this.currentUser.firstname)
    }
    this.textInput.setValue("");
    this.textInput.reset();
  }

  onKeydown(event) {
    if (event.key === "Enter") {
      this.sendMessage();
    }
  }

}
