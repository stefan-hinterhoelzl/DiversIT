import { Timestamp } from "@firebase/firestore";
import {User} from "firebase/auth";

export interface OUser {
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
}


export interface Mentor extends OUser {
    mentees: string[];
    company: string;
    maxMentees: number;
    girlsOnlyMentor: boolean;
}


export interface Mentee extends OUser{
    mentors: string[];
}



export interface CUser {
    firebaseUser: User;
    customUser: OUser;
}


