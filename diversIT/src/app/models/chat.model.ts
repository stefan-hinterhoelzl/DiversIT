import { Timestamp } from "@firebase/firestore";



export interface Message {
    text: string,
    senderUID: string,
    timestamp: Timestamp,
    sendingRelationship: string[],
}

export interface Chat {
    uid: string,
    connectedChat: string,
    recipientUser: string,
    lastMessage: string,
    lastMessageTime: Timestamp,
    amountNewMessages: number,
    lastCheckedTime: Timestamp,
    currentlyOnline: boolean,
}