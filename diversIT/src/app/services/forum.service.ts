import { increment } from '@firebase/firestore';
import { Injectable } from "@angular/core";
import { Answer, Thread } from '../models/forum.model';
import { addDoc, collection, doc, getDocs, getFirestore, limit, orderBy, query, startAfter, updateDoc, where } from 'firebase/firestore';

@Injectable({
    providedIn: 'root'
})
export class ForumService {

    db = getFirestore();
    lastVisibleThread;
    lastVisibleAnswer;

    constructor() { }

    async getFirstThreads(numberOfThreads: number, orderByField: string): Promise<Thread[]> {
        // Query the first page of docs
        const first = query(collection(this.db, "threads"),
            orderBy(orderByField, "desc"),
            limit(numberOfThreads));
        const documentSnapshots = await getDocs(first);

        // Get the last visible document
        if (documentSnapshots.size > 0) {
            this.lastVisibleThread = documentSnapshots.docs[documentSnapshots.docs.length - 1];
            console.log("last", this.lastVisibleThread);
        }

        const querySnapshot = await getDocs(first);
        let array: Thread[] = [];
        querySnapshot.forEach((doc) => {
            array.push(doc.data() as Thread)
        });
        return array;
    }

    async getNextThreads(numberOfThreads: number, orderByField: string): Promise<Thread[]> {
        // Construct a new query starting at this document,
        // get the next threads.
        const next = query(collection(this.db, "threads"),
            orderBy(orderByField, "desc"),
            startAfter(this.lastVisibleThread),
            limit(numberOfThreads));

        const querySnapshot = await getDocs(next);
        let array: Thread[] = [];
        querySnapshot.forEach((doc) => {
            array.push(doc.data() as Thread)
        });

        // Get the last visible document
        if (querySnapshot.size > 0) {
            this.lastVisibleThread = querySnapshot.docs[querySnapshot.docs.length - 1];
            console.log("last", this.lastVisibleThread);
        }

        return array;
    }

    async getAnswers(threadUID: string): Promise<Answer[]> {
        const q = query(collection(this.db, "answers"),
            where("threadUID", "==", threadUID),
            orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        let array: Answer[] = [];
        querySnapshot.forEach((doc) => {
            array.push(doc.data() as Answer)
        });
        return array;
    }

    async getFirstAnswers(threadUID: string, numberOfAnswers: number): Promise<Answer[]> {
        // Query the first page of docs
        const first = query(collection(this.db, "answers"),
            where("threadUID", "==", threadUID),
            orderBy("timestamp", "desc"),
            limit(numberOfAnswers));
        const documentSnapshots = await getDocs(first);

        // Get the last visible document
        if (documentSnapshots.size > 0) {
            this.lastVisibleAnswer = documentSnapshots.docs[documentSnapshots.docs.length - 1];
            console.log("last", this.lastVisibleAnswer);
        }

        const querySnapshot = await getDocs(first);
        let array: Answer[] = [];
        querySnapshot.forEach((doc) => {
            array.push(doc.data() as Answer)
        });
        return array;
    }

    async getNextAnswers(threadUID: string, numberOfAnswers: number): Promise<Answer[]> {
        // Construct a new query starting at this document,
        // get the next threads.
        const next = query(collection(this.db, "answers"),
            where("threadUID", "==", threadUID),
            orderBy("timestamp", "desc"),
            startAfter(this.lastVisibleAnswer),
            limit(numberOfAnswers));

        const querySnapshot = await getDocs(next);
        let array: Answer[] = [];
        querySnapshot.forEach((doc) => {
            array.push(doc.data() as Answer)
        });

        // Get the last visible document
        if (querySnapshot.size > 0) {
            this.lastVisibleAnswer = querySnapshot.docs[querySnapshot.docs.length - 1];
            console.log("last", this.lastVisibleAnswer);
        }

        return array;
    }

    async createThread(thread: Thread) {

        const docRef = collection(this.db, 'threads');
        const ref = await addDoc(docRef, {
            uid: "",
            created: thread.created,
            title: thread.title,
            text: thread.text,
            tags: thread.tags,
            numberOfAnswers: 0,
            lastAnswerTime: thread.created,
            views: 0,
        });

        await updateDoc(ref, {
            uid: ref.id
        });
    }

    async createAnswer(answer: Answer) {

        const docRef = collection(this.db, 'answers');
        const ref = await addDoc(docRef, {
            uid: "",
            threadUID: answer.threadUID,
            text: answer.text,
            timestamp: answer.timestamp,
        });

        await updateDoc(ref, {
            uid: ref.id
        });

        const threadRef = doc(this.db, "threads", answer.threadUID);

        await updateDoc(threadRef, {
            numberOfAnswers: increment(1),
            lastAnswerTime: answer.timestamp
        });
    }

    async incrementThreadViews(threadUID: string) {
        const threadRef = doc(this.db, "threads", threadUID);

        await updateDoc(threadRef, {
            views: increment(1)
        });
    }
}