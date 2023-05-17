import Firestore from '@/utils/Firestore'
import React, { useEffect } from 'react'
import s from '../styles/Tv.module.css'


const INTERNET_CHECK_INTERVAL_SEC = 1;
const ELECTION_UPDATE_INTERVAL_MIN = 0.001;
export default function tv() {
    const [results, setResults] = React.useState([])
    const [isConnected, setIsConnected] = React.useState(false)



    const loadResults = () => {
        Firestore.getVoteCountsInOneArray().then((counts) => {
            setResults(counts)
            console.log(counts)
        })
    }
    useEffect(loadResults, [])

    useEffect(() => {
        const interval = setInterval(() => loadResults(), 1000 * 60 * ELECTION_UPDATE_INTERVAL_MIN)
        return () => clearInterval(interval)
    }, [])

    useEffect(loadResults, [isConnected])

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



    let recentlyShowedCategory;

    return (
        <>
            <button onClick={loadResults} id='btnUpdateResults'>UPDATE DATA</button>
            {
                results?.map((item, catIndex) => {
                    console.log(item)
                    recentlyShowedCategory = item.category
                    return (
                        <div key={catIndex}>
                            {recentlyShowedCategory == item.category && <div className={s.category}>{item.category}</div>}
                            <div className={s.candidates}>
                                <div className={s.candidate} >
                                    <div className={s.candidate_name}>{item.candidate_name}</div>
                                    <div className={s.candidate_vote_count}>{item.candidate_vote_count}</div>

                                </div>

                            </div>
                        </div>
                    )

                }
                )
            }
        </>
    )
}
