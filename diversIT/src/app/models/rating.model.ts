import { Timestamp } from "@firebase/firestore";


/**
 * interface for rating mentors
 *
 * @export
 * @interface Rating
 */
export interface Rating {
    /** id of user generated from Firebase */
    userID: string,
    /** number between 0 and 5 in real usecase - representing the happiness of a mentee with its mentor */
    stars: number,
    /** short description of the review */
    summary: string,
    /** detailed review of the mentor */
    text: string,
    /** server Timestamp from firebase */
    lastUpdated: Timestamp,
    /** name of user */
    username: string,
    /** boolean default = false, can be changed by admin in adminpanel */
    displayOnLandingPage: boolean,
}