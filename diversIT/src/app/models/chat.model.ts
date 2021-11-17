import { Timestamp } from "@firebase/firestore";

export interface Message {
    text: string,
    sender: string,
    read: boolean,
    timestamp: Timestamp,
}

export interface Chat {
    uid: string,
    messages: Message[],
    participantA: string,
    participantB: string,
    lastMessage: string,
    newMessage: boolean
}