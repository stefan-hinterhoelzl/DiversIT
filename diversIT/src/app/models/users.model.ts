import {User} from "firebase/auth";

export interface OUser {
    role: number;
    email: string;
    uid: string;
}


export interface Mentor extends OUser {
    mentees: string[];
    company: string;
    maxMentees: number;
    //Schulbildung etc

}


export interface Mentee extends OUser{
    mentors: string[];
    //Schulebildung etc
}



export interface CUser {
    firebaseUser: User;
    customUser: OUser;
}


