import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import s from '@/styles/Home.module.css'
import { Forward, Key } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import Firestore from '@/utils/Firestore'
import Consts from '@/utils/Consts'

const inter = Inter({ subsets: ['latin'] })
const AUDIO_FOR_COMPLETED = "/completed_sound.wav"
const AUDIO_FOR_EACH_VOTE = "/vote_sound.mp3"
const AUDIO_TO_ENTER_NEXT_VOTER = "/next.mp3"
const WAITING_INTERVAL_TO_CLEAR_THE_VOTES_IN_SEC = 5
const WAITING_INTERVAL_TO_CALL_NEXT_VOTER_IN_SEC = 1 + WAITING_INTERVAL_TO_CLEAR_THE_VOTES_IN_SEC

// const candidatesUnderCategories = Consts

export default function Home() {
  const [candidatesUnderCategories, setCandidatesUnderCategories] = useState(Consts)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const isAuthorizedFromLocalStoragePass = () => {
    const passwordFromLocalStorage = localStorage.getItem('evm_password')
    if (passwordFromLocalStorage === process.env.LOCAL_STORAGE_EVM_PASS) {
      return true
    }
    return false
  }

  useEffect(() => {
    if (isAuthorizedFromLocalStoragePass()) setIsAuthorized(true)
    // BLOCKS THE USER FROM LEAVING THE PAGE
    window.onbeforeunload = function () {
      return "Dont leave the page";
    }
  }, [])

  // request full screen
  useEffect(() => {
    const main = document.getElementById('main')
    main?.requestFullscreen()
  }, [])
  if (!isAuthorized) return <div>not authorized</div>

  return (
    <main className={s.main} id="main">
      <div className={s.container}>
        <div className={s.top}>
          <span className={s.rect}></span>
          <span className={`${s.ready_light} ${s.green}`}></span>
        </div>
        <div className={s.voting_area}>
          <div className={s.display}>

            <DisplayOfCandidates candidatesUnderCategories={candidatesUnderCategories} setCandidatesUnderCategories={setCandidatesUnderCategories} />
          </div>
          <div className={s.buttons}>
            <ButtonsForVoting candidatesUnderCategories={candidatesUnderCategories} setCandidatesUnderCategories={setCandidatesUnderCategories} />

          </div>

        </div>
        <div className={s.bottom_area}>
          Election Commision of Maslac 2023
        </div>
      </div>
    </main>
  )
}

const DisplayOfCandidates = ({ candidatesUnderCategories, setCandidatesUnderCategories }) => (
  <>
    {
      candidatesUnderCategories?.map((category, index) => (
        <div key={index} >
          <div className={`${s.row} ${s.category_name}`} key={index}>{category.category}</div>
          {
            category?.candidates?.map((candidate, index) => (
              <div className={s.row} key={index}>
                <div className={s.candidate_name}>{candidate.name}</div>
                <div className={s.img_container}>
                  <img src={candidate.image} alt="" />
                  </div>
                
                </div>
            ))
          }
        </div>
      ))
    }
  </>
)

const ButtonsForVoting = ({ candidatesUnderCategories, setCandidatesUnderCategories }) => {

  return (
    <>
      {
        candidatesUnderCategories?.map((category, catIndex) => (
          <div key={catIndex}>
            <div className={`${s.row} ${s.category_name}`}></div>
            {
              category?.candidates?.map((candidate, candiIndex) => (
                <div className={s.row} key={candiIndex}>
                  <Forward className={`${s.forward_icon} ${candidate.voted && s.isSelected}`} />
                  <button className={s.vote_button} onClick={() => voteButtonPressedAction(category.category, candidate.name, setCandidatesUnderCategories, catIndex, candiIndex, candidatesUnderCategories)}></button>
                </div>
              ))
            }
          </div>
        ))
      }
      <button onClick={() => clearVotes(setCandidatesUnderCategories)}>CLEAR VOTES</button>
    </>
  )
}
const voteButtonPressedAction = async (category, candidateName, setCandidatesUnderCategories, catIndex, candiIndex, candidatesUnderCategories) => {
  // if (candidatesUnderCategories[catIndex].candidates[candiIndex].voted) return

  let alreadyVotedInThisCat = false
  candidatesUnderCategories?.[catIndex].candidates.forEach(candidate => {
    if (candidate.voted) alreadyVotedInThisCat = true
  })
  if (alreadyVotedInThisCat) return

  let votedOnAllCategories = true;
  let votedCatList = []
  candidatesUnderCategories?.forEach(cat => {
    let votedOnThisCat = false
    cat.candidates.forEach(candi => {
      if (candi.voted) {
        votedOnThisCat = true
        votedCatList.push(cat.category)
      }
    })
    if (votedOnThisCat) votedOnAllCategories = true
  })
  if (votedCatList.length != candidatesUnderCategories?.length - 1) votedOnAllCategories = false


  const vote = {
    category,
    candidateName,
    votingTime: new Date(Date.now()),
    voterCategory: window.localStorage.getItem('voter_category') || ''
  }
  await Firestore.submitTheVoteAsNumberOnly(vote).then(() => {
    setCandidatesUnderCategories(currentData => {
      currentData[catIndex].candidates[candiIndex].voted = true
      const completedAudio = new Audio(AUDIO_FOR_EACH_VOTE)
      completedAudio.play()
      return [...currentData]
    })
  }).catch(err => {
  })
  if (!votedOnAllCategories) return

  const completedAudio = new Audio(AUDIO_FOR_COMPLETED)
  completedAudio.play()

  setTimeout(() => {
    clearVotes(setCandidatesUnderCategories)

  }, 1000 * WAITING_INTERVAL_TO_CLEAR_THE_VOTES_IN_SEC);
  setTimeout(() => {
    const nextVoterAudio = new Audio(AUDIO_TO_ENTER_NEXT_VOTER)
    nextVoterAudio.play()

  }, 1000 * WAITING_INTERVAL_TO_CALL_NEXT_VOTER_IN_SEC);

}

const clearVotes = (setCandidatesUnderCategories) => {
  console.log("Clearing...")
  setCandidatesUnderCategories((catCandidates => {
    catCandidates.forEach((cat) => {
      cat.candidates.forEach(candi => {
        candi.voted = false
      });
    })
    console.log("cleared")

    return [...catCandidates]

  }))
}

