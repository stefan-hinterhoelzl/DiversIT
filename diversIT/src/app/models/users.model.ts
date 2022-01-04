import { Timestamp } from "@firebase/firestore";


/**
 * interface of diversITUser - base model for mentees, mentors and admins
 *
 * @export
 * @interface DiversITUser
 */
export interface DiversITUser {
    /** 1=admin; 2=mentor; 3=mentee */
    role: number; 
    /** email of user */
    email: string;
    /** firstname of user (may add the middlename here) */
    firstname: string;
    /** lastname or sirname of user */
    lastname: string;
    /** Male/Female/Diverse */
    gender: string; 
    /** URL to Profilephoto */
    photoURL: string;
    /** school at primary/elementary level e.g.: Keine Angabe/Hauptschule/Gymnasium*/
    primaryEducation: string;
    /** school at higher level e.g.: Keine Angabe/Gymnasium/Hak/HTL*/
    secondaryEducation: string;
    /** university degree e.g.: Keine Angaben/Bachelorstudium/Masterstudium/Doktorat */
    universityEducation: string;
    /** Dev Ops/Developer/UI Designer/Scrum Master/... */
    job: string;
    /** unique id of user - may be left with null if it is a new user - db will generate a id and update the document*/
    uid: string;
    /** servertimestamp of firestore */
    creationTime: Timestamp;
    /** servertimestamp of firestore */
    lastLoggedIn: Timestamp;
    /** list of all mentee ids */
    mentees?: string[];
    /** textrepresentation of companyname */
    company?: string;
    /** optional number of menteelimit */
    maxMentees?: number;
    /** true = only female mentees are allowed to send mentorship requests */
    girlsOnlyMentor?: boolean;
    /** list of all mentor ids */
    mentors?: string[];
    /** personalized mentortext  */
    backgroundInfo?: string[];
    /** list of unseen notifications like mentorrequests */
    notifications?: Notification[];
}
