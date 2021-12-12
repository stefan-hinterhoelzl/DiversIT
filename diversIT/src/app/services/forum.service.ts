import { getAuth } from '@firebase/auth';
import { child, getDatabase, onValue, orderByChild, push, query, ref, serverTimestamp, update } from 'firebase/database';
import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { ObserversService } from './observers.service';
import { Answer, Thread } from '../models/forum.model';

@Injectable({
    providedIn: 'root'
})
export class ForumService {

    database = getDatabase();

    auth = getAuth();

    constructor(private router: Router, private observer: ObserversService) { }

    forumsub;

    getThreads() {
        const threadsRef = query(ref(this.database, "threads"), orderByChild("lastAnswerTime"));

    }

    getAnswers(threadUID: string) {
        const answersRef = query(ref(this.database, "threads/" + threadUID + "/answers"), orderByChild("timestamp"));

    }

    async createThread(title: string, text: string, tags: string[], anonymous?: boolean) {
        console.log("createThread in forumService is called");
        let currentUser = this.observer.getcurrenUserValue;

        console.log("get new key")
        const newThreadKey = push(child(ref(this.database), "threads")).key;

        console.log("set anonymous true if no user is logged in")
        if (currentUser == null) anonymous = true;
        console.log("anonymous flag is:" + anonymous);

        const newThread = <Thread>{
            uid: newThreadKey,
            created: serverTimestamp(),
            userUID: currentUser != null ? currentUser.uid : "",
            anonymous: anonymous != null ? anonymous : false,
            title: title,
            text: text,
            tags: tags,
            numberOfAnswers: 0,
            lastAnswerTime: serverTimestamp(),
            upvotedBy: [],
            downvotedBy: [],
            totalVotes: 0,
            views: 0,
            display: true,
        }

        const updates = {};
        updates["threads/" + newThreadKey] = newThread;

        console.log("update database");
        await update(ref(this.database), updates);
    }

    async createAnswer(threadUID: string, text: string, anonymous?: boolean) {
        console.log("createAnswer in forumService is called");
        let currentUser = this.observer.getcurrenUserValue;

        console.log("get new key")
        const newAnswerKey = push(child(ref(this.database), "threads/" + threadUID + "/answers")).key;

        console.log("set anonymous true if no user is logged in")
        if (currentUser == null) anonymous = true;
        console.log("anonymous flag is:" + anonymous);

        const newAnswer = <Answer>{
            uid: newAnswerKey,
            userUID: currentUser != null ? currentUser.uid : "",
            anonymous: anonymous != null ? anonymous : false,
            text: text,
            upvotedBy: [],
            downvotedBy: [],
            totalVotes: 0,
            display: true,
        }

        const updates = {};
        const ThreadRef = ref(this.database, "threads/" + threadUID);
        onValue(ThreadRef, (snapshot) => {
            const data = snapshot.val() as Thread;

            updates["threads/" + threadUID + "/lastAnswerTime"] = serverTimestamp();
            updates["threads/" + threadUID + "/numberOfAnswers"] = data.numberOfAnswers + 1;
            updates["threads/" + threadUID + "/answers/" + newAnswerKey] = newAnswer;

            console.log("update database");
            update(ref(this.database), updates);
        }, {
            onlyOnce: true
        });
    }
}