import { Timestamp } from "@firebase/firestore";

export interface Answer {
    uid: string,
    userUID: string,
    anonymous: boolean,
    text: string,
    timestamp: Timestamp,
    threadUID: string,
    upvotedBy: string[],
    downvotedBy: string[],
    totalVotes: number,
    display: boolean,
}

export interface Thread {
    uid: string,
    created: Timestamp,
    userUID: string,
    anonymous: boolean,
    title: string,
    text: string,
    tags: string[],
    numberOfAnswers: number,
    lastAnswerTime: Timestamp,
    upvotedBy: string[],
    downvotedBy: string[],
    totalVotes: number,
    views: number,
    display: boolean,
}