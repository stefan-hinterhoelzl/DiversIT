import * as functions from "firebase-functions"
import * as admin from "firebase-admin"

//import * as cors from "cors";
//const corsHandler = cors({origin: true});

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

admin.initializeApp()

export const createRelationship = functions.https.onCall((data, context) => {

    let mentee: string = data.mentee;
    let mentor: string = data.mentor;

    const batch = admin.firestore().batch();

    let menteeRef = admin.firestore().collection("users").doc(mentee);
    let mentorRef = admin.firestore().collection("users").doc(mentor);

    batch.update(menteeRef, {
        mentors: admin.firestore.FieldValue.arrayUnion(mentor)
    });

    batch.update(mentorRef, {
        mentees: admin.firestore.FieldValue.arrayUnion(mentee)
    });

    return batch.commit();

});


export const revokeRelationship = functions.https.onCall((data, context) => {
    let mentee: string = data.mentee;
    let mentor: string = data.mentor;

    const batch = admin.firestore().batch();

    let menteeRef = admin.firestore().collection("users").doc(mentee);
    let mentorRef = admin.firestore().collection("users").doc(mentor);

    batch.update(menteeRef, {
        mentors: admin.firestore.FieldValue.arrayRemove(mentor)
    });

    batch.update(mentorRef, {
        mentees: admin.firestore.FieldValue.arrayRemove(mentee)
    });

    batch.commit().then(() => {
        return admin.database().ref("messages/" + mentor + mentee).remove();
    });
})

exports.aggregateThreads = functions.firestore
    .document('threads/{uid}')
    .onWrite(event => {

        // get all threads and aggregate
        return admin.firestore().collection('threads').orderBy('created', 'desc')
            .get()
            .then(querySnapshot => {

                // get the total thread count
                const threadCount = querySnapshot.size

                // data to update on the document
                const data = { threadCount }

                // run update
                return admin.firestore().collection('threads').doc('metadata').update(data)
            })
            .catch(err => console.log(err))
    });

