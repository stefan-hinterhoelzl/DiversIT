import { Timestamp } from "@firebase/firestore";

export interface Notification{
    timestamp: Timestamp;
    text: string;
    mentorName: string;
    mentorUID: string;
}