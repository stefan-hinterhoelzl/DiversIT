import { Injectable } from "@angular/core"
import { collection, doc, getFirestore, setDoc } from "firebase/firestore"
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
}