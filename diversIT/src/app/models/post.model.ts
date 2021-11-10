import { Timestamp } from "@firebase/firestore";

export interface Post {
    userID: string,
    text: string,
    timestamp: Timestamp,
    photoURL?: string,
}

export interface PostDisplay {
    userName: string,
    userImgURL: string,
    text: string,
    timestamp: Timestamp,
    photoURL?: string,
}