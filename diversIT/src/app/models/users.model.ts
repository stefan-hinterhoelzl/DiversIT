import { Timestamp } from "@firebase/firestore";


export interface DiversITUser {
    role: number; //1=admin; 2=mentor; 3=mentee
    email: string;
    firstname: string;
    lastname: string;
    gender: string; //Male or Female
    photoURL: string;
    primaryEducation: string;
    secondaryEducation: string;
    universityEducation: string;
    job: string;
    uid: string;
    creationTime: Timestamp;
    lastLoggedIn: Timestamp;
    chats: string[];
    mentees?: string[];
    company?: string;
    maxMentees?: number;
    girlsOnlyMentor?: boolean;
    mentors?: string[];
}
