
import "firebase/compat/firestore"
import firebase from 'firebase/compat/app'
import Consts from "./Consts";


export const VOTE_VALUE = 1;

const db = () => {
    const firebaseConfig = {
        apiKey: process.env.API_KEY,
        authDomain: process.env.AUTH_DOMAIN,
        projectId: process.env.PROJECT_ID,
        appId: process.env.APP_ID,
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    return firebase.firestore();

}
export default {

    submitTheVoteAsNumberOnly: function (vote) {
        return new Promise((resolve, reject) => {
            let candidateCurrentVoteCount = 0;
            let updatedExisting = false;
            db().collection('votes').get().then(async (snapShot) => {
                snapShot.docs.forEach(async (doc) => {
                    const docData = doc.data();
                    if (doc.id == vote.category) {
                        candidateCurrentVoteCount = docData[vote.candidateName] || 0;
                        let updateData = { ...docData }
                        updateData[vote.candidateName] = candidateCurrentVoteCount + 1
                        await db()
                            .collection('votes')
                            .doc(vote.category)
                            .update(updateData)
                            .then(() => {
                                updatedExisting = true;
                                resolve()
                            }).catch(() => {
                                reject()
                            })
                    }
                    
                });
            })
        })



    },


    getVoteCountsInOneArrayFromDBSavedWithNumbers: async function () {
        let counts = {};
        return new Promise((resolve, reject) => {
            db().collection('votes').get().then(async (snapShot) => {
                snapShot.docs.forEach(async (doc) => {
                    const docData = doc.data();
                    counts[doc.id] = docData;

                });
            }).then(() => {
                resolve(counts)
            })
        })
    },
}

