import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { child, getDatabase, onValue, orderByChild, push, ref, serverTimestamp, set, update, query, increment, onDisconnect, equalTo } from 'firebase/database'
import { collection, doc, getDocs, getFirestore, updateDoc, query as queryFirestore, arrayRemove, runTransaction } from '@firebase/firestore';
import { Chat, Message } from '../models/chat.model';
import { arrayUnion, where } from 'firebase/firestore';
import { BehaviorSubject, pipe } from 'rxjs';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { DiversITUser } from '../models/users.model';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { Router } from '@angular/router';
import { DomElementSchemaRegistry } from '@angular/compiler';
import { UserService } from './user.service';
import { take } from 'rxjs/operators';
import { ObserversService } from './observers.service';
import { MatGridTileHeaderCssMatStyler } from '@angular/material/grid-list';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private snackbar: SnackbarComponent, private router: Router, private observer: ObserversService) { }





  database = getDatabase()

  //to Update the Chatsarray in the user Field
  firestore = getFirestore()

  //Auth Instance to listen for auth changes
  auth = getAuth()

  chatsub;
  currentChatPartners: DiversITUser[] = [];

  lastamount: number = 0;


  initializeChat(user: DiversITUser) {
    if (user.role == 2) this.currentChatPartners = this.observer.getCurrentUserMenteesValue;
    if (user.role == 3) this.currentChatPartners = this.observer.getCurrentUserMentorsValue;

    console.log(this.currentChatPartners)
    this.getChatsOfUser(user)
  }

  getChatsOfUser(user: DiversITUser) {
    if (this.chatsub != null) this.chatsub();
    const userChatsRef = query(ref(this.database, user.uid), orderByChild("lastMessageTime"));
    this.chatsub = onValue(userChatsRef, async (snapshot) => {
      if (snapshot.exists()) {
        const chats: Chat[] = []
        snapshot.forEach((childSnapshot) => {
          chats.push(childSnapshot.val() as Chat)
        })
        chats.reverse()

        console.log(chats)
        console.log(this.currentChatPartners)

        //there is a missing Chat Object
        if (chats.length < this.currentChatPartners.length) {
          //find the missing chatpartner
          for (let i = 0; i < this.currentChatPartners.length; i++) {
            console.log(this.currentChatPartners[i]);
            let chat = chats.find((value) => { return value.recipientUser == this.currentChatPartners[i].uid });
            if (chat == undefined) {
              //create the chat object for the new user -- which triggers a rerun of this code
              this.createChat(user.uid, this.currentChatPartners[i].uid);
              return;
            }
          }
        } else if (chats.length > this.currentChatPartners.length) {
          for (let i = 0; i < chats.length; i++) {
            let chatpartner = this.currentChatPartners.find((value) => { return value.uid == chats[i].recipientUser })
            if (chatpartner == undefined) {
              //when the overflow chat was found -- delte that one
              this.deleteChat(chats[i], this.observer.getcurrenUserValue.uid);
              return;
            }
          }
        }

        //variable for the amount of new Messages
        let number: number = 0;

        //sorted Array for the Names of the Chat Partners
        const sortedarr: DiversITUser[] = []


        for (let i = 0; i < chats.length; i++) {
          let x = this.currentChatPartners.find((curr) => { return curr.uid == chats[i].recipientUser })
          sortedarr.push(x)
          number += chats[i].amountNewMessages
        }

        //Handle Amount of New Messages
        this.observer.number.next(number);

        //Handle the opening of the snackbar
        if (this.lastamount < number) {
          if (!this.router.url.includes("chat")) {
            if (number - this.lastamount == 1) {
              let snackBarRef = this.snackbar.openSnackBar("Sie haben " + (number - this.lastamount).toString() + " neue Nachricht", null, "zum Chat")
              snackBarRef.onAction().subscribe(() => {
                this.router.navigate(['/chat']);
              });
            }
            else {
              let snackBarRef = this.snackbar.openSnackBar("Sie haben " + (number - this.lastamount).toString() + " neue Nachrichten", null, "zum Chat")
              snackBarRef.onAction().subscribe(() => {
                this.router.navigate(['/chat']);
              });
            }
          }

          //set the new lastamount after the if conditions for the snackbar
          this.lastamount = number;

          //Play Message Sound
          let audio = new Audio();
          audio.src = "../../assets/sounds/ringtone.mp3";
          audio.load();
          audio.play();

        } else {
          this.lastamount = 0;
        }

        //Create the data for the Chat Observable
        const payload = {
          chats: chats,
          users: sortedarr,
        }

        console.log(payload)

        this.observer.chats.next(payload);
      } else {
        if (this.currentChatPartners.length == 1) {
          this.createChat(user.uid, this.currentChatPartners[0].uid)
        }
      }
    });
  }


  async addRelationship(mentee: string, mentor: string) {
    const docRefMentor = doc(this.firestore, "users", mentor);
    const docRefMentee = doc(this.firestore, "users", mentee)

    await updateDoc(docRefMentor, {
      mentees: arrayUnion(mentee)
    });

    await updateDoc(docRefMentee, {
      mentors: arrayUnion(mentor)
    });
  }

  async revokeRelationship(mentee: string, mentor: string) {
    runTransaction(this.firestore, async (transacion) => {
      const docRefMentor = doc(this.firestore, "users", mentor);
      const docRefMentee = doc(this.firestore, "users", mentee);

      transacion.update(docRefMentor, {
        mentees: arrayRemove(mentee)
      });
      transacion.update(docRefMentee, {
        mentors: arrayRemove(mentor)
      });
    });
  }



  async deleteChat(chat: Chat, currentUser: string) {
    //mentor and mentee chat objects

    //transactional updates on database
    const updates = {}
    updates['/' + chat.recipientUser + '/' + chat.uid] = null
    updates['/' + currentUser + '/' + chat.uid] = null
    updates['/messages' + '/' + chat.uid] = null

    await update(ref(this.database), updates)

  }


  async createChat(mentee: string, mentor: string) {
    let newKey = push(child(ref(this.database), mentee)).key;


    const MentorChat = <Chat>{
      uid: newKey,
      lastMessage: "",
      connectedChat: newKey,
      recipientUser: mentee,
      amountNewMessages: 0,
      lastCheckedTime: serverTimestamp(),
      lastMessageTime: serverTimestamp(),
      currentlyOnline: false,
    }

    const MenteeChat = <Chat>{
      uid: newKey,
      lastMessage: "",
      connectedChat: newKey,
      recipientUser: mentor,
      amountNewMessages: 0,
      lastCheckedTime: serverTimestamp(),
      lastMessageTime: serverTimestamp(),
      currentlyOnline: false,
    }

    const updates = {};
    updates['/' + mentee + '/' + newKey] = MenteeChat;
    updates['/' + mentor + '/' + newKey] = MentorChat;

    await update(ref(this.database), updates);

  }


  sendMessage(chat: Chat, text: string, sender: DiversITUser) {


    const newMessageKey = push(child(ref(this.database), "messages")).key;

    const message = <Message>{
      text: text,
      senderUID: sender.uid,
      timestamp: serverTimestamp(),
    };



    const updates = {}
    const ChatRef = ref(this.database, sender.uid + "/" + chat.uid);
    onValue(ChatRef, (snapshot) => {
      const data = snapshot.val() as Chat;

      if (!data.currentlyOnline) {
        updates[chat.recipientUser + "/" + chat.uid + "/lastMessage"] = text;
        updates[chat.recipientUser + "/" + chat.uid + "/lastMessageTime"] = serverTimestamp();
        updates[chat.recipientUser + "/" + chat.uid + "/amountNewMessages"] = increment(1);
      } else {
        updates[chat.recipientUser + "/" + chat.uid + "/lastMessage"] = text;
        updates[chat.recipientUser + "/" + chat.uid + "/lastMessageTime"] = serverTimestamp();
      }

      updates[sender.uid + "/" + chat.uid + "/lastMessage"] = text;
      updates[sender.uid + "/" + chat.uid + "/lastMessageTime"] = serverTimestamp();

      updates["messages/" + chat.uid + "/" + newMessageKey] = message;

      update(ref(this.database), updates);

    }, {
      onlyOnce: true
    });
  }

  getMessages(chat: Chat) {
    const messagesRef = query(ref(this.database, "messages/" + chat.uid), orderByChild("timestamp"));
    return onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const messages: Message[] = []
        snapshot.forEach((childSnapshot) => {
          messages.push(childSnapshot.val() as Message)
        })
        messages.reverse();
        this.observer.messages.next(messages);
      } else {
        this.observer.messages.next([]);
      }
    });
  }


  openChat(chat: Chat, user: DiversITUser) {
    const updates = {}
    updates[this.database, chat.recipientUser + "/" + chat.uid + "/currentlyOnline"] = true;
    updates[this.database, user.uid + "/" + chat.uid + "/amountNewMessages"] = 0;

    const r = ref(this.database, chat.recipientUser + "/" + chat.uid + "/currentlyOnline")
    const o = onDisconnect(r);
    o.set(false);

    return update(ref(this.database), updates);
  }


  closeChat(chat: Chat, user: DiversITUser) {
    const updates = {}
    updates[this.database, chat.recipientUser + "/" + chat.uid + "/currentlyOnline"] = false;
    updates[this.database, chat.recipientUser + "/" + chat.uid + "/lastCheckedTime"] = serverTimestamp();

    return update(ref(this.database), updates);
  }

}
