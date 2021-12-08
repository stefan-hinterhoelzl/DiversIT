import { Timestamp } from "@firebase/firestore";

export interface Post {
    userID: string,
    text: string,
    timestamp: Timestamp,
    photoURL?: string,
    uid: string
}

export interface PostDisplay {
    userID: string,
    userName: string,
    userImgURL: string,
    text: string,
    timestamp: Timestamp,
    photoURL?: string,
}