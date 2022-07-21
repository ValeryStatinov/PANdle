import classnames from 'classnames/bind'
import { differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns'
import { Attempts, TileType } from 'hooks/useGame'
import React, { useEffect, useRef, useState } from 'react'

import styles from './WinModal.module.scss'

const cx = classnames.bind(styles)

type Props = {
  todaysPan: {
    word: string
    date: number
    img: string
  }
  attempts: Attempts
  getTileType: (char: string, index: number) => TileType
}

export const WinModal = ({ todaysPan, attempts, getTileType }: Props) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const tomorrowRef = useRef(new Date())
  const [buttonAnimate, setButtonAnimate] = useState(false)

  useEffect(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    tomorrowRef.current = tomorrow

    const interval = setInterval(() => {
      const now = new Date()
      setCurrentDate(now)

      if (now.getTime() > tomorrow.getTime()) {
        location.reload()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleShare = () => {
    setButtonAnimate(true)
    let shareString = 'I guessed a PANdle today!\n'

    for (const attempt of attempts.submitted) {
      for (let i = 0; i < attempt.length; i++) {
        const char = attempt[i]
        const tileType = getTileType(char, i)

        switch (tileType) {
          case 'correct': {
            shareString += '🟩'
            break
          }

          case 'normal': {
            shareString += '⬜'
            break
          }

          case 'pan': {
            shareString += '🟪'
            break
          }

          case 'present': {
            shareString += '🟨'
            break
          }
        }
      }

      shareString += '\n'
    }

    if (navigator.share !== undefined) {
      void navigator.share({ text: shareString })
    } else {
      void navigator.clipboard.writeText(shareString)
      setTimeout(() => alert('Copied to clipboard'), 350)
    }
  }

  let hours = String(differenceInHours(tomorrowRef.current, currentDate))
  let minutes = String(differenceInMinutes(tomorrowRef.current, currentDate) % 60)
  let seconds = String(differenceInSeconds(tomorrowRef.current, currentDate) % 60)

  if (hours.length < 2) {
    hours = `0${hours}`
  }

  if (minutes.length < 2) {
    minutes = `0${minutes}`
  }

  if (seconds.length < 2) {
    seconds = `0${seconds}`
  }

  return (
    <>
      <div className={cx('backdrop')} />
      <div className={cx('modal')}>
        <h2>
          Congratulations!
          <br />
          New PAN unlocked
        </h2>
        <img src={todaysPan.img} alt="PAN" className={cx('panPhoto')} />
        <h3>
          Next PANdle in <br />
          {hours}:{minutes}:{seconds}
        </h3>
        <button
          className={cx('share', { share__shake: buttonAnimate })}
          onClick={handleShare}
          onAnimationEnd={() => setButtonAnimate(false)}
        >
          Share
        </button>
      </div>
    </>
  )
}
