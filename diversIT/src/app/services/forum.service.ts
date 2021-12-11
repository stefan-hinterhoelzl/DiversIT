import { serverTimestamp } from 'firebase/firestore';
import { getAuth } from '@firebase/auth';
import { child, getDatabase, onValue, orderByChild, push, query, ref } from 'firebase/database';
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
        return onValue(threadsRef, (snapshot) => {
            if (snapshot.exists()) {
                const threads: Thread[] = [];
                snapshot.forEach((childSnapshot) => {
                    threads.push(childSnapshot.val() as Thread);
                })
                threads.reverse();
                this.observer.threads.next(threads);
            } else {
                this.observer.threads.next([]);
            }
        });
    }

    getAnswers(thread: Thread) {
        const answersRef = query(ref(this.database, "answers/" + thread.uid), orderByChild("timestamp"));
        return onValue(answersRef, (snapshot) => {
            if (snapshot.exists()) {
                const answers: Answer[] = [];
                snapshot.forEach((childSnapshot) => {
                    answers.push(childSnapshot.val() as Answer);
                })
                answers.reverse();
                this.observer.answers.next(answers);
            } else {
                this.observer.answers.next([]);
            }
        });
    }

    async createThread(anonymous: boolean, title: string, text: string, tags: string[]) {
        let currentUser = this.observer.getcurrenUserValue;

        /*     let currentUser: DiversITUser = null;
            this.observer.currentUserStatus.subscribe((user) => {
              if (user != null) currentUser = user;
            });
             */
        const newThreadKey = push(child(ref(this.database), "threads")).key;

        if (currentUser == null) anonymous = true;

        const newThread = <Thread>{
            uid: newThreadKey,
            created: serverTimestamp(),
            userUID: currentUser != null ? currentUser.uid : "",
            anonymous: anonymous,
            title: title,
            text: text,
            tags: tags,
            answers: [],
            lastAnswerTime: serverTimestamp(),
            upvotedBy: [],
            downvotedBy: [],
            totalVotes: 0,
            views: 0,
            display: true,
        }
    }

    async createAnswer(thread: Thread, text: string,) {

    }

}