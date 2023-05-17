
import "firebase/compat/firestore"
import firebase from 'firebase/compat/app'
import Consts from "./Consts";


export const VOTE_VALUE = 10;

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
    submitTheVote: function (vote) {
        return new Promise((resolve, reject) => {
            db().collection('votes').doc().set(vote).then(() => {
                resolve()
                console.log("submitted to net")
            }).catch(() => {
                reject()
                alert("Seems to have network issues.")
            })
        })

    },


    getVoteCounts: async function () {
        let counts = [];

        Consts.forEach(async (category, categoryIndex) => {
            let currentCategory = {
                category: '',
                candidate_votes: []
            };
            currentCategory.category = category.category;
            await category.candidates.forEach(async (candidate, candIndex) => {
                let currentCandidate = {
                    candidate_name: '',
                    candidate_vote_count: 0,
                };
                let voteCount = 0;
                await db().collection('votes').get().then(async (snapShot) => {
                    snapShot.docs.forEach(async (doc) => {
                        // console.log(doc.data())
                        const docData = doc.data();
                        if (docData.candidateName == candidate.name) {
                            voteCount++;
                        }
                    });
                }).then(() => {
                    currentCandidate.candidate_name = candidate.name;
                    currentCandidate.candidate_vote_count = voteCount * VOTE_VALUE;
                }).finally(() => {
                    currentCategory.candidate_votes.push(currentCandidate);
                })
            })
            counts.push(currentCategory);
            console.log("first", counts)
        })
        // console.log(counts)
        return counts
    },
    getVoteCountsInOneArray: async function () {
        let counts = [];
        return new Promise((resolve, reject) => {
            Consts.forEach(async (category, categoryIndex, array) => {

                category.candidates.forEach(async (candidate, candIndex) => {
                    let currentCandidate = {
                        candidate_name: '',
                        candidate_vote_count: 0,
                        category: category.category
                    };
                    let voteCount = 0;
                    await db().collection('votes').get().then(async (snapShot) => {
                        snapShot.docs.forEach(async (doc) => {
                            // console.log(doc.data())
                            const docData = doc.data();
                            if (docData.candidateName == candidate.name) {
                                voteCount++;
                            }
                        });
                    }).then(() => {
                        currentCandidate.candidate_name = candidate.name;
                        currentCandidate.candidate_vote_count = voteCount * VOTE_VALUE;
                    }).then(() => {
                        counts.push(currentCandidate);
                    }).finally(() => {
                        // currentCategory.candidate_votes.push(currentCandidate);

                        if (categoryIndex === array.length - 1) {
                            console.log("counts", counts)
                            resolve(counts)
                        }
                    })
                })
            })
        })
    },
}