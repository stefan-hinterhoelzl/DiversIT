import { Injectable, OnDestroy } from "@angular/core";
import { update } from "@firebase/database";
import { addDoc, arrayUnion, collection, deleteDoc, doc, getDocs, getFirestore, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { Subscriber, Subscription } from "rxjs";
import { Notification } from "../models/notification.model";
import { Post } from "../models/post.model";
import { ObserversService } from "./observers.service";


@Injectable({
    providedIn: 'root'
  })
  export class PostsService implements OnDestroy {

    db = getFirestore();
    unsubscribeFromPosts;
    constructor(private observer: ObserversService) {}

    ngOnDestroy(): void {
      this.unsubscribeFromPosts()
    }

    async getPostUser(userID: string): Promise<Post[]> {
        const q = query(collection(this.db, "posts"), where("userID", "==", userID), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        let array: Post[] = [];
        querySnapshot.forEach((doc) => {
          array.push(doc.data() as Post)
        });
        return array;
      }
    
      async getPostOfUserObservable(userID: string) {
        this.unsubscribeFromPosts = onSnapshot(query(collection(this.db, "posts"), where("userID", "==", userID), orderBy("timestamp", "desc")), (q) => {
          let arr: Post[] = []
          q.forEach((doc) => {
            arr.push(doc.data() as Post)
          }
          )
          this.observer.currentUserPosts.next(arr)
        })
      }
    
    
      async addPost(post: Post) {
        const docRef = collection(this.db, 'posts')
        const ref = await addDoc(docRef, {
          userID: post.userID,
          photoURL: post.photoURL,
          timestamp: post.timestamp,
          text: post.text,
          uid: ""
        })
    
        await updateDoc(ref, {
          uid: ref.id
        })
      }

      async deletePost(postUID: string){
        await deleteDoc(doc(this.db, "posts", postUID));
      }

      async updatePost(postUID: string, content: string, imageURL: string){
        await updateDoc(doc(this.db, "posts", postUID), {
            text: content,
            photoURL: imageURL
        })
      }
      



  }
