import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { AfterViewInit, ChangeDetectorRef, Component, ContentChild, ElementRef, HostListener, NgZone, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Chat, Message } from '../models/chat.model';
import { DiversITUser } from '../models/users.model';
import { UserService } from '../services/user.service';
import { take } from 'rxjs/operators';
import { ChatService } from '../services/chat.service';
import { ThisReceiver } from '@angular/compiler';
import { ActivatedRoute, Router } from '@angular/router';
import { ObserversService } from '../services/observers.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  currentUser: DiversITUser
  currentUserSubscription: Subscription
  combinedname: string;
  currentChats: Chat[];
  currentChatUsers: DiversITUser[];
  currentChatNames: string[] = [];
  currentChatPartner: DiversITUser;
  currentChatPartnerCombinedName: string;
  currentChatsSubscription: Subscription

  
  messageSubscription: Subscription;
  messages: Message[];
  messagesVisible: boolean = false;

  
  chatOpen: boolean = false;
  activeChat: Chat;
  activeChatUID: string = "";

  chatunsub

  textInput: FormControl

  toggled: boolean = false;

  @ViewChild('myInput') input: ElementRef;
  @ViewChild('messageList') myList: ElementRef;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  constructor(private user: UserService, private _ngZone: NgZone, private database: ChatService, private route: ActivatedRoute, private router: Router, private observer: ObserversService) {
    this.textInput = new FormControl('', Validators.required);
   }
  

  /**
   * unsubscribes from all subscription when being destroyed
   *
   * @return {*}  {Promise<void>}
   * @memberof ChatComponent
   */
  async ngOnDestroy(): Promise<void> {
    if (this.chatunsub != null) {
      await this.database.closeChat(this.activeChat, this.currentUser);
      this.chatunsub();
    }
    this.currentChatsSubscription.unsubscribe();
    this.currentUserSubscription.unsubscribe();
    if (this.messageSubscription != null) this.messageSubscription.unsubscribe();
  }

   triggerResize() {
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  /** when created, the current user is loaded with all it's chats.  */
  ngOnInit(): void {
    this.currentUserSubscription = this.observer.currentUserStatus.subscribe((data) => {
      if(data !== null) {
        //set the current user
        this.currentUser = data;
        this.combinedname = this.currentUser.firstname + " " + this.currentUser.lastname;
      }
    

        //get the current Chats
        this.currentChatsSubscription = this.observer.chatStatus.subscribe((data) => {
          if (data.length != 0) {
            this.currentChats = data.chats;
            this.currentChatUsers = data.users;
            //create the Name Arrays for the Chats
            for (let i = 0; i<this.currentChatUsers.length; i++) {
              if (this.currentChatUsers[i].firstname.length + this.currentChatUsers[i].lastname.length > 25) {
                this.currentChatNames[i] = this.currentChatUsers[i].firstname + " " + this.currentChatUsers[i].lastname.charAt(0) + ".";
              } else {
                this.currentChatNames[i] = this.currentChatUsers[i].firstname + " " + this.currentChatUsers[i].lastname;
              }
            }
          }
        })
      });
        if (this.currentChats != null) {
          this.initialize(this.currentUser);
        }
  }

  initialize(user: DiversITUser) {
    let k: string = this.route.snapshot.paramMap.get('k');

    if (k != "") {
      let chat = this.currentChats.find((value) => {
        return value.recipientUser === k;
      });
      if (chat != null) this.openChat(chat)
    }
  }


  /**
   * called when the user clicks on a specific chat
   * loads all necessary data for the visualisation (e.g. firstname lastname of chat participant) and
   * sets own activity status to online for chat partner
   * 
   * @param {Chat} chat
   * @return {*} 
   * @memberof ChatComponent
   */
  async openChat(chat: Chat) {
    if (this.activeChat != undefined && this.activeChat.uid === chat.uid) return;
    this.messagesVisible = false;
    this.chatOpen = true;
    if (this.chatunsub != null) {
      await this.database.closeChat(this.activeChat, this.currentUser);
      this.chatunsub();
    } 
    this.chatunsub = this.database.getMessages(chat)
    this.messageSubscription = this.observer.messagesStatus.subscribe(async (data) => {
      this.messages = data;
    });
    await this.database.openChat(chat, this.currentUser);
    this.activeChat = chat;
    this.activeChatUID = chat.uid
    this.currentChatPartner = this.currentChatUsers.find((user) => {return user.uid == chat.recipientUser})
    this.currentChatPartnerCombinedName = this.currentChatPartner.firstname + " " + this.currentChatPartner.lastname;
    if (this.input != undefined) this.input.nativeElement.focus();
    this.messagesVisible = true;

  }


  /** takes the value of the chat inputbox and uses the database service to send and 
   * persist the data on the real time database */
  sendMessage() {
    let trimmed = this.textInput.value.trim();
    if (trimmed != "") {
      this.database.sendMessage(this.activeChat, trimmed , this.currentUser)
    }
    this.textInput.setValue("");
  }

  /** listens on every keystroke - if keystroke is the enter key, the message is sent to firebase. */
  onKeydown(event) {
    if (event.key === "Enter") {
      event.preventDefault()
      this.sendMessage();
    }
  }
    

  /** unsubscribes from the chat when windows is being unloaded*/
  @HostListener('window:beforeunload', ['$event'])
  async beforeUnloadHandler(event) {
    await this.database.closeChat(this.activeChat, this.currentUser);
    this.chatunsub();
  }

  /** same method as above - this is in some cases additionally necessary */
  @HostListener('window:onunload', ['$event'])
  async onUnloadHandler(event) {
    await this.database.closeChat(this.activeChat, this.currentUser);
    this.chatunsub();
  }

  /** adds the char of the exent to the textinput of the chatwindow */
  handleSelection(event) {
    this.textInput.setValue(this.textInput.value+event.char);
  }

  /** routing which is called when the user clicks on the image or name of the chat partner */
  navigateToUser(id: string) {
    this.router.navigate(["/profile/"+id])
  }


}

