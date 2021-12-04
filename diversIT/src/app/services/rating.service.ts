import { Injectable } from "@angular/core"
import { collection, doc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore"
import { Rating } from "../models/rating.model"

@Injectable({
    providedIn: 'root'
})
export class RatingService {

    db = getFirestore();

    async addRating(rating: Rating) {
        const docRef = doc(collection(this.db, 'ratings'))
        await setDoc(docRef, rating)
    }

    async getDisplayRatings(): Promise<Rating[]> {
        const q = query(collection(this.db, "ratings"), where("displayOnLandingPage", "==", true));
        const querySnapshot = await getDocs(q);
        let array: Rating[] = []
        querySnapshot.forEach((doc) => {
            let rating = doc.data() as Rating;
            array.push(rating);
        });
        return array;
    }
}