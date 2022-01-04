import { Injectable, OnDestroy } from "@angular/core";
import { update } from "@firebase/database";
import { addDoc, arrayUnion, collection, deleteDoc, doc, getDocs, getFirestore, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { Subscriber, Subscription } from "rxjs";
import { Notification } from "../models/notification.model";
import { Post } from "../models/post.model";
import { ObserversService } from "./observers.service";


/**
 * serviceclass for all firebase related operations of post elements
 *
 * @export
 * @class PostsService
 * @implements {OnDestroy}
 */
@Injectable({
    providedIn: 'root'
  })
  export class PostsService implements OnDestroy {

    db = getFirestore(); /** connection to firebase */
    unsubscribeFromPosts; /** global variable which is needed to unsubscribe the observer */

    /**
     * Creates an instance of PostsService.
     * @param {ObserversService} observer
     * @memberof PostsService
     */
    constructor(private observer: ObserversService) {}


    /**
     *
     * cancles the subscription of posts on destroy of the service
     * @memberof PostsService
     */
    ngOnDestroy(): void {
      this.unsubscribeFromPosts()
    }


    /**
     * gets all posts of a user by userID ordered by timestamp descending
     *
     * @param {string} userID string of the userID
     * @returns {*}  {Promise<Post[]>}
     * @memberof PostsService
     */
    async getPostUser(userID: string): Promise<Post[]> {
        const q = query(collection(this.db, "posts"), where("userID", "==", userID), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        let array: Post[] = [];
        querySnapshot.forEach((doc) => {
          array.push(doc.data() as Post)
        });
        return array;
      }
    

      /**
       * creates a listener for the post observable - should only be called by initializing the service class
       *
       * @param {string} userID
       * @memberof PostsService
       */
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
    
    
      /**
       * creates a post on firebase
       *
       * @param {Post} post object containing all necessary information
       * @memberof PostsService
       */
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


      /**
       * deletes a post from database
       *
       * @param {string} postUID id of post to delete
       * @memberof PostsService
       */
      async deletePost(postUID: string){
        await deleteDoc(doc(this.db, "posts", postUID));
      }


      /**
       * updates an existing post
       *
       * @param {string} postUID if of post
       * @param {string} content content of post
       * @param {string} imageURL image of post - null if no image
       * @memberof PostsService
       */
      async updatePost(postUID: string, content: string, imageURL: string){
        await updateDoc(doc(this.db, "posts", postUID), {
            text: content,
            photoURL: imageURL
        })
      }
      



  }
