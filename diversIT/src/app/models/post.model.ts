import { Timestamp } from "@firebase/firestore";


/**
 * interface of a default post
 *
 * @export
 * @interface Post
 */
export interface Post {
    /** id of user who generated the post */
    userID: string,
    /** text content of the post */
    text: string,
    /** timestamp generated by firebase */
    timestamp: Timestamp,
    /** optional a photourl if post contains one */
    photoURL?: string,
    /** unique id of the post itself, generated by firebase */
    uid: string
}


/**
 * interface for a post which can be displayed to the user
 * this interface combines data from the user who postet der post originally and the data of the post itself
 * e.g. profile image url and content of post
 * @export
 * @interface PostDisplay
 */
export interface PostDisplay {
    /** id of user who generated the post */
    userID: string,
    /** name of the user who generated the post */
    userName: string,
    /** url to the profileime of the user who generated the post */
    userImgURL: string,
    /** text content of the post */
    text: string,
    /** timestamp of the creation of the post */
    timestamp: Timestamp,
    /** optional a url to a photo which should be displayed in the post */
    photoURL?: string,
}