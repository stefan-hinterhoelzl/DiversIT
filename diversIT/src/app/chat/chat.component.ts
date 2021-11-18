import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
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


  constructor(private firestore: FirestoreService) {
    this.textInput = new FormControl('', Validators.required);
   }

  ngOnInit(): void {
    this.currentUserSubscription = this.firestore.currentUserStatus.subscribe((data) => {
      if(data !== null) {
        this.currentUser = data;
        this.currentChatsSubscription = this.firestore.chatStatus.subscribe((data) => {
          this.currentChats = data;
        })
        this.initialize(data);
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
    this.activeChat = chat.uid;

  }


  sendMessage() {
    this.firestore.sendMessage(this.activeChat, this.textInput.value, this.currentUser.firstname).then(() => {
      this.textInput.setValue("");
    })
  }

}
