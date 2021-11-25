import { Injectable } from '@angular/core';
import { child, getDatabase, onValue, orderByChild, push, ref, serverTimestamp, set, update, query, increment, onDisconnect } from 'firebase/database'
import { collection, doc, getDocs, getFirestore, updateDoc, query as queryFirestore} from '@firebase/firestore';
import { Chat, Message } from '../models/chat.model';
import { arrayUnion, where} from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { DiversITUser } from '../models/users.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor() {
    this.authStatusListener();
   }

  database = getDatabase()

  //to Update the Chatsarray in the user Field
  firestore = getFirestore()

  //Auth Instance to listen for auth changes
  auth = getAuth()

  private chats: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  chatStatus = this.chats.asObservable();
  chatsub;


  private messages: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);
  messagesStatus = this.messages.asObservable();


  authStatusListener() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.getChatsOfUser(user.uid);
      } else {
        if (this.chatsub != undefined) this.chatsub();
      }
    });
  }

  async getAllChatPartnerUsers(arr: string[]) {
    const q = queryFirestore(collection(this.firestore, "users"), where("uid", "in", arr));
    let array: DiversITUser[] = []
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      array.push(doc.data() as DiversITUser)
    });
    return array;
  }



  getChatsOfUser(user: string) {
    const userChatsRef = query(ref(this.database, user), orderByChild("lastMessageTime"));
    this.chatsub = onValue(userChatsRef, async (snapshot) => {
        if (snapshot.exists()) {
          const chats: Chat[] = []
          const users: string[] = []
          snapshot.forEach((childSnapshot) => {
            chats.push(childSnapshot.val() as Chat)
            users.push((childSnapshot.val() as Chat).recipientUser)
          })
          chats.reverse()
          let array = await this.getAllChatPartnerUsers(users);
          
          const sortedarr: DiversITUser[] = []
          for (let i = 0; i<chats.length; i++) {
            let x = array.find((curr) => { return curr.uid == chats[i].recipientUser})
            sortedarr.push(x)
          }
          
          const payload = {
            chats: chats,
            users: sortedarr,
          }

          this.chats.next(payload);
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

    this.createChat(mentee, mentor);

  }

  async createChat(mentee: string, mentor: string) {
    let newKey = push(child(ref(this.database), mentee)).key;
    

    const MentorChat = <Chat> {
      uid: newKey,
      lastMessage: "",
      connectedChat: newKey,
      recipientUser: mentee,
      amountNewMessages: 0,
      lastCheckedTime: serverTimestamp(),
      lastMessageTime: serverTimestamp(),
      currentlyOnline: false,
    }

    const MenteeChat = <Chat> {
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
    updates['/'+mentee+'/'+newKey] = MenteeChat;
    updates['/'+mentor+'/'+newKey] = MentorChat;

    await update(ref(this.database), updates);

  }


  sendMessage(chat: Chat, text: string, sender: DiversITUser) {
    

    const newMessageKey = push(child(ref(this.database), "messages")).key;

    const message = <Message> {
      text: text,
      senderUID: sender.uid,
      timestamp: serverTimestamp(),
    };

    

    const updates = {}

    const ChatRef = ref(this.database, sender.uid+"/"+chat.uid);
    onValue(ChatRef, (snapshot) => {
      const data = snapshot.val() as Chat;

      if (!data.currentlyOnline) {
        updates[chat.recipientUser+"/"+chat.uid+"/lastMessage"] = text;
        updates[chat.recipientUser+"/"+chat.uid+"/lastMessageTime"] = serverTimestamp();
        updates[chat.recipientUser+"/"+chat.uid+"/amountNewMessages"] = increment(1);
      } else {
        updates[chat.recipientUser+"/"+chat.uid+"/lastMessage"] = text;
        updates[chat.recipientUser+"/"+chat.uid+"/lastMessageTime"] = serverTimestamp();
      }

      updates[sender.uid+"/"+chat.uid+"/lastMessage"] = text;
      updates[sender.uid+"/"+chat.uid+"/lastMessageTime"] = serverTimestamp();

      updates["messages/"+chat.uid+"/"+newMessageKey] = message;

      update(ref(this.database), updates);
      
    }, {
      onlyOnce: true
    });
  }

  getMessages(chat: Chat) {
    const messagesRef = query(ref(this.database, "messages/"+chat.uid), orderByChild("timestamp"));
    return onValue(messagesRef, (snapshot) => {
        if (snapshot.exists()) {
          const messages: Message[] = []
          snapshot.forEach((childSnapshot) => {
            messages.push(childSnapshot.val() as Message)
          })
          this.messages.next(messages);
        }
      });
  }


  openChat(chat: Chat, user: DiversITUser) {
    const updates = {}
    updates[this.database, chat.recipientUser+"/"+chat.uid+"/currentlyOnline"] = true;
    updates[this.database, user.uid+"/"+chat.uid+"/amountNewMessages"] = 0;

    const r = ref(this.database, chat.recipientUser+"/"+chat.uid+"/currentlyOnline")
    const o = onDisconnect(r);
    o.set(false);
   
    return update(ref(this.database), updates);
  }


  closeChat(chat: Chat, user: DiversITUser) {
    const updates = {}
    updates[this.database, chat.recipientUser+"/"+chat.uid+"/currentlyOnline"] = false;
    updates[this.database, chat.recipientUser+"/"+chat.uid+"/lastCheckedTime"] = serverTimestamp();
   
    return update(ref(this.database), updates);
  }

}
