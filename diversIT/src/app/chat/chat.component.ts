import { Component, OnInit } from '@angular/core';
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
  currentMentors: DiversITUser[]
  currentMentorsSubscription: Subscription
  chatOpen: boolean = false;
  chatUser: DiversITUser;
  chatSubscription: Subscription;
  activeChat: Message[];



  constructor(private firestore: FirestoreService) { }

  ngOnInit(): void {
    this.currentUserSubscription = this.firestore.currentUserStatus.subscribe((data) => {
      if(data !== null) {
        this.currentUser = data;
        this.currentMentorsSubscription = this.firestore.currentUserMentorsStatus.subscribe((mentors) => {
          this.currentMentors = mentors;
        });
        this.initialize(data);
      }
    });
  }

  initialize(user: DiversITUser) {

  }

  openChat(user: DiversITUser) {
    this.firestore.activateChatListener('hj5ZQxmORwhr8noxi3DH')
    this.chatSubscription = this.firestore.messagesStatus.subscribe((data) => {
      this.activeChat = data;
      console.log(data);
    });

    this.chatUser = user;
    this.chatOpen = true;

  }


  sendMessage() {
    this.firestore.sendMessage();
  }

}
