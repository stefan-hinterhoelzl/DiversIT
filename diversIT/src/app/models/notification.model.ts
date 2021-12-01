import { Timestamp } from "@firebase/firestore";

export interface Notification{
    fromName: string,
    fromPhotoURL: string,
    fromUID: string,
    toUID: string,
    text?: string,
    type: number, // Type: 1 = Mentor-Anfrage (Buttons: Annehmen, Ablehnen); 2 = Info (Keine Buttons)
    when: Timestamp,
    uid: string
}