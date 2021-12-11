import { Timestamp } from "@firebase/firestore";

export interface Answer {
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
    answers: string[],
    lastAnswerTime: Timestamp,
    upvotedBy: string[],
    downvotedBy: string[],
    totalVotes: number,
    views: number,
    display: boolean,
}