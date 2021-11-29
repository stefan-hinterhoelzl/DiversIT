import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Chat, Message } from '../models/chat.model';
import { DiversITUser } from '../models/users.model';

@Injectable({
  providedIn: 'root'
})
export class ObserversService {

  //Number of new Chat Messages
  number: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  numberStatus = this.number.asObservable();

  //Messages of one Chat instance
  messages: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);
  messagesStatus = this.messages.asObservable();

  //Chats of one User
  chats: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  chatStatus = this.chats.asObservable();

  //The currently logged in user's document
  currentUser: BehaviorSubject<DiversITUser> = new BehaviorSubject<DiversITUser>(null);
  currentUserStatus = this.currentUser.asObservable();

  //The currently logged in user's Mentors
  currentUserMentors: BehaviorSubject<DiversITUser[]> = new BehaviorSubject<DiversITUser[]>([]);
  currentUserMentorsStatus = this.currentUserMentors.asObservable()

  //The currently logged in user's Mentees
  currentUserMentees: BehaviorSubject<DiversITUser[]> = new BehaviorSubject<DiversITUser[]>([]);
  currentUserMenteesStatus = this.currentUserMentors.asObservable()

  
  constructor() { }


  //Static getters for the Behaviour Subjects
  get getNumberValue(): number {
    return this.number.value;
  }

  get getMessagesValue(): Message[] {
    return this.messages.value;
  }

  get getChatsValue(): Chat[] {
    return this.chats.value;
  }

  get getcurrenUserValue(): DiversITUser {
    return this.currentUser.value;
  }

  get getCurrentUserMentorsValue(): DiversITUser[] {
    return this.currentUserMentors.value;
  }

  get getCurrentUserMenteesValue(): DiversITUser[] {
    return this.currentUserMentees.value;
  }

}
