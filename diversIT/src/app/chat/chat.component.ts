import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { AfterViewInit, ChangeDetectorRef, Component, ContentChild, ElementRef, HostListener, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AngularMaterialModule } from '../angular-material-module';
import { Chat, Message } from '../models/chat.model';
import { DiversITUser } from '../models/users.model';
import { UserService } from '../services/user.service';
import { take } from 'rxjs/operators';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  currentUser: DiversITUser
  currentUserSubscription: Subscription
  currentChats: Chat[];
  currentChatUsers: DiversITUser[];
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

  constructor(private user: UserService, private _ngZone: NgZone, private database: ChatService) {
    this.textInput = new FormControl('', Validators.required);
   }

   triggerResize() {
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  ngOnInit(): void {
    this.currentUserSubscription = this.user.currentUserStatus.subscribe((data) => {
      if(data !== null) {
        this.currentUser = data;
        this.currentChatsSubscription = this.database.chatStatus.subscribe((data) => {
          if (data != null) {
            this.currentChats = data.chats;
            this.currentChatUsers = data.users;
            if (this.currentChats != null) {
              this.initialize(this.currentUser);
            }
          }
        })
      }
    });
  }

  initialize(user: DiversITUser) {

  }

  async openChat(chat: Chat) {
    if (this.chatunsub != null) {
      await this.database.closeChat(this.activeChat, this.currentUser);
      this.chatunsub();
    } 
    this.chatunsub = this.database.getMessages(chat)
    this.messageSubscription = this.database.messagesStatus.subscribe(async (data) => {
      this.messages = data;
      if (data != null) {
        this.chatOpen = true;
        setTimeout(()=> this.scrollToBottom(), 0)
      }
    });
    await this.database.openChat(chat, this.currentUser);
    this.activeChat = chat;
    this.activeChatUID = chat.uid
    if (this.input != undefined) this.input.nativeElement.focus();

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

  scrollToBottom() {
    this.myList.nativeElement.scrollTop = this.myList.nativeElement.scrollHeight - this.myList.nativeElement.clientHeight
  }

  @HostListener('window:beforeunload', ['$event'])
  async beforeUnloadHandler(event) {
    await this.database.closeChat(this.activeChat, this.currentUser);
    this.chatunsub();
  }


}

