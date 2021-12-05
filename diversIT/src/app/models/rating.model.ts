import { Timestamp } from "@firebase/firestore";

export interface Rating {
    userID: string,
    stars: number,
    summary: string,
    text: string,
    lastUpdated: Timestamp,
    username: string,
    displayOnLandingPage: boolean,
}