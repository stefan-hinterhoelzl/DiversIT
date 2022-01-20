import { getDoc, increment } from '@firebase/firestore';
import { Injectable } from "@angular/core";
import { Answer, Thread } from '../models/forum.model';
import { addDoc, collection, doc, getDocs, getFirestore, limit, orderBy, query, startAfter, updateDoc, where } from 'firebase/firestore';


/**
 * Service class which allows interaction with firebase and handles all forum related data transactions
 *
 * @export
 * @class ForumService
 */
@Injectable({
    providedIn: 'root'
})
export class ForumService {

    /** connection to Firestore */
    db = getFirestore();
    /** keeps track of the last seen thread, necessary as we do use pagination */
    lastVisibleThread;
    /** keeps track of the last seen answer, necessary as we do use pagination */
    lastVisibleAnswer;


    /**
     * Creates an instance of ForumService.
     * @memberof ForumService
     */
    constructor() { }

    
    /**
     *
     *
     * @param {number} numberOfThreads the number of thread that should be gathered
     * @param {string} orderByField the field the table should be ordered by. E.g. created
     * @return {*}  {Promise<Thread[]>}
     * @memberof ForumService
     */
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


    /**
     * return a single thread based on the provided id
     *
     * @param {string} threadUID
     * @return {*}  {Promise<Thread>}
     * @memberof ForumService
     */
    async getThreadByUID(threadUID: string): Promise<Thread> {
        const q = doc(this.db, "threads", threadUID)
        const docSnap = await getDoc(q)
        return docSnap.data() as Thread
    }


    /**
     * loads the next threads, uses the global variable to know where to continue
     *
     * @param {number} numberOfThreads amount of threads that should be loaded
     * @param {string} orderByField the field the table should be ordered by. E.g. created. 
     * It is advised to use the same ordering as on th method getFirstThreads
     * @return {*}  {Promise<Thread[]>}
     * @memberof ForumService
     */
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


    /**
     * gets all answers to a certain thread
     *
     * @param {string} threadUID
     * @return {*}  {Promise<Answer[]>}
     * @memberof ForumService
     */
    async getAnswers(threadUID: string): Promise<Answer[]> {
        const q = query(collection(this.db, "answers"),
            where("threadUID", "==", threadUID),
            orderBy("timestamp", "asc"));
        const querySnapshot = await getDocs(q);
        let array: Answer[] = [];
        querySnapshot.forEach((doc) => {
            array.push(doc.data() as Answer)
        });
        return array;
    }


    /**
     * gets only a subset of all answers of a thread, ordered by creation date
     *
     * @param {string} threadUID thread id you want the answers from
     * @param {number} numberOfAnswers number of answers to load
     * @return {*}  {Promise<Answer[]>}
     * @memberof ForumService
     */
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


    /**
     * get next set of answers, continues from the global set variable
     *
     * @param {string} threadUID id of thread id you want the answers from
     * @param {number} numberOfAnswers amount of answers to return
     * @return {*}  {Promise<Answer[]>}
     * @memberof ForumService
     */
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



    /**
     * does add a thread document to the threads collection in firestore 
     *
     * @param {Thread} thread object of type Thread
     * @memberof ForumService
     */
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



    /**
     *  does add a answer document to the answers collection in firestore 
     *
     * @param {Answer} answer
     * @memberof ForumService
     */
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



    /**
     * Updates a thread. It does increas the amount of views by one
     *
     * @param {string} threadUID
     * @memberof ForumService
     */
    async incrementThreadViews(threadUID: string) {
        const threadRef = doc(this.db, "threads", threadUID);

        await updateDoc(threadRef, {
            views: increment(1)
        });
    }

    /** returns the total number of threads. */
    async getNumberOfThreads(): Promise<number> {
        const q = doc(this.db, "threads", "metadata")
        const docSnap = await getDoc(q)
        return docSnap.get("threadCount")
    }
}