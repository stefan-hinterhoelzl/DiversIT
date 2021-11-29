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

  constructor(private user: UserService, private _ngZone: NgZone, private database: ChatService, private route: ActivatedRoute, private router: Router) {
    this.textInput = new FormControl('', Validators.required);
   }
  async ngOnDestroy(): Promise<void> {
    if (this.chatunsub != null) {
      await this.database.closeChat(this.activeChat, this.currentUser);
      this.chatunsub();
    }
    this.currentChatsSubscription.unsubscribe();
    this.currentUserSubscription.unsubscribe();
    this.messageSubscription.unsubscribe();
  }

   triggerResize() {
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  ngOnInit(): void {
    this.currentUserSubscription = this.user.currentUserStatus.subscribe((data) => {
      if(data !== null) {
        this.currentUser = data;
        this.combinedname = this.currentUser.firstname + " " + this.currentUser.lastname;
        this.currentChatsSubscription = this.database.chatStatus.subscribe((data) => {
          if (data != null) {
            this.currentChats = data.chats;
            this.currentChatUsers = data.users;
            for (let i = 0; i<this.currentChatUsers.length; i++) {
              console.log(this.currentChatUsers);
              if (this.currentChatUsers[i].firstname.length + this.currentChatUsers[i].lastname.length > 25) {
                this.currentChatNames[i] = this.currentChatUsers[i].firstname + " " + this.currentChatUsers[i].lastname.charAt(0) + ".";
              } else {
                this.currentChatNames[i] = this.currentChatUsers[i].firstname + " " + this.currentChatUsers[i].lastname;
              }
            }

            
          }
        })
        if (this.currentChats != null) {
          this.initialize(this.currentUser);
        }
      }
    });
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

  async openChat(chat: Chat) {
    if (this.activeChat != undefined && this.activeChat.uid === chat.uid) return;
    this.messagesVisible = false;
    this.chatOpen = true;
    if (this.chatunsub != null) {
      await this.database.closeChat(this.activeChat, this.currentUser);
      this.chatunsub();
    } 
    this.chatunsub = this.database.getMessages(chat)
    this.messageSubscription = this.database.messagesStatus.subscribe(async (data) => {
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


  sendMessage() {
    let trimmed = this.textInput.value.trim();
    if (trimmed != "") {
      this.database.sendMessage(this.activeChat, trimmed , this.currentUser)
    }
    this.textInput.setValue("");
  }

  onKeydown(event) {
    if (event.key === "Enter") {
      event.preventDefault()
      this.sendMessage();
    }
  }
    

  @HostListener('window:beforeunload', ['$event'])
  async beforeUnloadHandler(event) {
    await this.database.closeChat(this.activeChat, this.currentUser);
    this.chatunsub();
  }

  @HostListener('window:onunload', ['$event'])
  async onUnloadHandler(event) {
    await this.database.closeChat(this.activeChat, this.currentUser);
    this.chatunsub();
  }

  handleSelection(event) {
    this.textInput.setValue(this.textInput.value+event.char);
  }

  navigateToUser(id: string) {
    this.router.navigate(["/profile/"+id])
  }


}

