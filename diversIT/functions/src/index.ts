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

export const menteeToMentor = functions.https.onCall((data, context) => {
  let user: string = data.user;
  let mentors: string[] = data.mentors;

  let ref = admin.firestore().collection("users").doc(user);

  const batch = admin.firestore().batch();

  batch.update(ref, {
    mentors: [],
    role: 2
  });

  for (let i = 0; i < mentors.length; i++) {
    let mref = admin.firestore().collection("users").doc(mentors[i]);
    batch.update(mref, {
      mentees: admin.firestore.FieldValue.arrayRemove(user)
    })
  }

  return batch.commit();
})

export const mentorToMentee = functions.https.onCall((data, context) => {
  let user: string = data.user;
  let mentees: string[] = data.mentees;

  let ref = admin.firestore().collection("users").doc(user);

  const batch = admin.firestore().batch();

  batch.update(ref, {
    mentees: [],
    role: 3
  });

  for (let i = 0; i < mentees.length; i++) {
    let mref = admin.firestore().collection("users").doc(mentees[i]);
    batch.update(mref, {
      mentors: admin.firestore.FieldValue.arrayRemove(user)
    })
  }

  return batch.commit();
})

export const alterDisplaySetting = functions.https.onCall((data, context) => {
  let ratingUserID: string = data.userID;
  let value: boolean = data.value;

  return admin.firestore().collection("ratings").where("userID", "==", ratingUserID).get()
  .then((querySnapshot) => {
    let ref = querySnapshot.docs[0].ref
    ref.update({
      displayOnLandingPage: value,
    })
  })
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

