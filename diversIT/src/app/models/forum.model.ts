import { Timestamp } from "@firebase/firestore";

export interface Answer {
    uid: string,
    text: string,
    timestamp: Timestamp,
    threadUID: string,
}

export interface Thread {
    uid: string,
    created: Timestamp,
    title: string,
    text: string,
    tags: string[],
    numberOfAnswers: number,
    lastAnswerTime: Timestamp,
    views: number,
}