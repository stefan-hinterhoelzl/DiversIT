import { Injectable } from "@angular/core"
import { getApp } from "firebase/app";
import { collection, doc, getDoc, getDocs, getFirestore, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore"
import { getFunctions, httpsCallable } from "firebase/functions";
import { Rating } from "../models/rating.model"

/**
 * service for rating mentors
 *
 * @export
 * @class RatingService
 */
@Injectable({
    providedIn: 'root'
})
export class RatingService {
    /** Firestore connection variable */
    db = getFirestore(); 
    /** Firestore Functions variable */
    functions = getFunctions(getApp()) 


    /**
     *  updates a rating and creates a new one if it does not already exist
     *
     * @param {Rating} rating Interface object containing the rating information
     * @memberof RatingService
     */
    async updateRating(rating: Rating) {
        const docRef = doc(collection(this.db, 'ratings'))
        const q = query(collection(this.db, 'ratings'), where('userID', '==', rating.userID));
        const querySnapshot = await getDocs(q);

        // check if there already is a rating for this user
        if (querySnapshot.empty) {
            // if there is no rating for this user yet, create new rating
            await setDoc(docRef, rating)
        } else {
            // if there is a rating for this user already, update that so there is always only one rating per user
            const docRef = querySnapshot.docs[0].ref;

            updateDoc(docRef, {
                stars: rating.stars,
                summary: rating.summary,
                text: rating.text,
                username: rating.username,
                lastUpdated: serverTimestamp(),
                displayOnLandingPage: false,
            });
        }
    }



    /**
     * gets all ratings from db
     *
     * @returns {*}  {Promise<Rating[]>}
     * @memberof RatingService
     */
    async getAllRatings(): Promise<Rating[]> {
        const querySnapshot = await getDocs(collection(this.db, 'ratings'));
        let array: Rating[] = []
        querySnapshot.forEach((doc) => {
            array.push(doc.data() as Rating)
        });
        return array;
    }



    /**
     * Gets a rating vor a specific user
     *
     * @param {string} userID string of userID
     * @returns {*}  {Promise<Rating>}
     * @memberof RatingService
     */
    async getRatingForUserID(userID: string): Promise<Rating> {
        const q = query(collection(this.db, 'ratings'), where('userID', '==', userID));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.docs.length > 0) {
            return querySnapshot.docs[0].data() as Rating;
        } else return null;
    }


    /**
     * gets the ratings which are allowed to be displayed on the landing page (decided by admin in adminpanle)
     *
     * @returns {*}  {Promise<Rating[]>}
     * @memberof RatingService
     */
    async getDisplayedRatings(): Promise<Rating[]> {
        const q = query(collection(this.db, 'ratings'), where('displayOnLandingPage', '==', true));
        const querySnapshot = await getDocs(q);
        let array: Rating[] = []
        querySnapshot.forEach((doc) => {
            let rating = doc.data() as Rating;
            array.push(rating);
        });
        return array;
    }

    /**
     * alters the display setting for showing the rating on the landing page
     *
     * @param rating the rating to be altered
     * @returns
     */
    alterDisplaySetting(rating: Rating) {
      const alterDisplaySettings = httpsCallable(this.functions, "alterDisplaySetting")
      return alterDisplaySettings({userID: rating.userID, value: !rating.displayOnLandingPage})
    }
}
