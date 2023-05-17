import Firestore, { VOTE_VALUE } from '@/utils/Firestore'
import React, { useEffect } from 'react'
import s from '../styles/Tv.module.css'
import Consts from '@/utils/Consts';


const INTERNET_CHECK_INTERVAL_SEC = 10;
const ELECTION_UPDATE_INTERVAL_MIN = 5;
export default function Tv() {
    const [results, setResults] = React.useState([])
    const [isConnected, setIsConnected] = React.useState(false)
    const [biggestVoteCount, setBiggestVoteCount] = React.useState(0)


    const loadResults = () => {
        const merged = []
        let newCategoryToMerge = {}
        Firestore.getVoteCountsInOneArrayFromDBSavedWithNumbers().then((counts) => {
            console.log(counts)

            Consts.map((category, catIndex) => {
                newCategoryToMerge = {}
                newCategoryToMerge.category = category.category

                newCategoryToMerge.candidates = []
                category.candidates.map((candidate, canIndex) => {
                    const voteCount = counts[category.category][candidate.name] || 0
                    const candidateName = candidate.name
                    const image = candidate.image
                    newCategoryToMerge.candidates.push({ name: candidateName, image, voteCount })
                })
                merged.push(newCategoryToMerge)
            })


            // setResults(counts)
        }).then(() => {
            console.log("data got MERGED _________", merged)

            setResults(merged)
        })
    }



    useEffect(() => {
        let interval;
        setTimeout(() => {
            interval = setInterval(() => loadResults(), 1000 * 60 * ELECTION_UPDATE_INTERVAL_MIN)
        }, 1000 * 60 * ELECTION_UPDATE_INTERVAL_MIN);
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        loadResults()
    }, [isConnected])

    useEffect(() => {
        const interval = setInterval(() => {
            fetch('https://www.google.com/', { mode: 'no-cors' })
                .then(() => {
                    setIsConnected(true)
                    console.log('connected')
                }).catch(() => {
                    setIsConnected(false)
                    console.log('not connected')
                })
        }, 1000 * INTERNET_CHECK_INTERVAL_SEC)
        return () => clearInterval(interval)
    }, [])


    return (
        <div className={s.main}>
            <div className={s.container}>
                {
                    results.map((category, catIndex) => {
                        // console.log("category", category)
                        // console.log("max", getBiggestNumberOfVotes(category.category, results))
                        return <div className={`${s.category_item} ${category.category}`} key={catIndex}>
                            <div className={s.category_name}>{category.category}</div>
                            <div className={s.candidate_list}>
                                {

                                    category.candidates.map((candidate, canIndex) => {
                                        const voteCount = candidate.voteCount * VOTE_VALUE
                                        if (voteCount > biggestVoteCount) setBiggestVoteCount(voteCount)
                                        const candidateName = candidate.name
                                        // "use strict"


                                        return (
                                            <div className={s.candidate_item} key={canIndex}>
                                                <div className={s.left}>
                                                    <div className={s.img_container}>
                                                        <img src={candidate.image} alt="" />
                                                    </div>
                                                </div>
                                                <div className={s.right}>
                                                    <div className={s.progress_bar} style={{ width: `calc(${voteCount / biggestVoteCount * 100}% - 3rem)` }}>
                                                        <div className={s.vote_count}>{voteCount}</div>
                                                    </div>
                                                    <div className={s.candidate_name}>{candidate.name}</div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>

                    })
                }
            </div>
            <button onClick={loadResults} id='btnUpdateResults'>UPDATE DATA</button>

        </div>
    )
}
