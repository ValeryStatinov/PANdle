import { pans } from 'constants/pans'
import { useCallback, useEffect, useRef, useState } from 'react'

const isSameDay = (d1: Date, d2: Date) => {
  return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()
}

const noMorePans = () => {
  const today = new Date()
  const lastPanDate = pans[pans.length - 1].date

  return !isSameDay(today, new Date(lastPanDate)) && today.getTime() > lastPanDate
}

const getTodaysWord = () => {
  const today = new Date()

  return pans.find((pan) => isSameDay(new Date(pan.date), today))
}

const getAllOccurrenceIndexes = (word: string[], char: string) => {
  return word.reduce((acc, cur, i) => {
    if (cur === char) {
      acc.push(i)
    }

    return acc
  }, [] as number[])
}

// TODO add pan type
export type TileType = 'normal' | 'present' | 'correct' | 'pan'

const fillWordCharsMap = (word: string[]) => {
  const wordCharsMap = new Map<string, number[]>()

  word.forEach((char) => {
    if (wordCharsMap.has(char)) {
      return
    }

    const occurrenceIndexes = getAllOccurrenceIndexes(word, char)

    wordCharsMap.set(char, occurrenceIndexes)
  })

  return wordCharsMap
}

export type Attempt = string[]

export type Attempts = {
  submitted: Attempt[]
  current: Attempt
  rest: Attempt[]
}

const createAttempts = (word: string[]): Attempts => {
  const submitted: string[][] = []
  const current = new Array(word.length).fill('') as string[]
  const rest: string[][] = []

  for (let i = 0; i < 5; i++) {
    rest.push(new Array(word.length).fill('') as string[])
  }

  return {
    submitted,
    current,
    rest,
  }
}

export const useGame = () => {
  const [isInited, setIsInited] = useState(false)
  const [isNoMorePans, setIsNoMorePans] = useState(false)
  const [wordArr, setWordArr] = useState<string[]>([])
  const [attempts, setAttempts] = useState<Attempts>({
    submitted: [],
    current: [],
    rest: [],
  })
  const [isWin, setIsWin] = useState(false)
  const wordsCharsMapRef = useRef<Map<string, number[]>>(new Map())
  const panIndexRef = useRef(-1)
  const [todaysPan, setTodaysPan] = useState<{
    word: string
    date: number
    img: string
  }>({ word: '', date: 0, img: '' })

  useEffect(() => {
    if (noMorePans()) {
      setIsInited(true)
      setIsNoMorePans(true)

      return
    }

    const todaysPan = getTodaysWord()

    if (!todaysPan) return

    const wordArr = todaysPan.word.split('')

    panIndexRef.current = todaysPan.word.indexOf('пан')
    wordsCharsMapRef.current = fillWordCharsMap(wordArr)

    setAttempts(createAttempts(wordArr))
    setWordArr(wordArr)
    setTodaysPan(todaysPan)
    setIsInited(true)
  }, [])

  const getTileType = (char: string, index: number): TileType => {
    if (!wordsCharsMapRef.current.has(char)) return 'normal'

    const panIndex = panIndexRef.current

    if (
      (char === 'п' && index === panIndex) ||
      (char === 'а' && index === panIndex + 1) ||
      (char === 'н' && index === panIndex + 2)
    ) {
      return 'pan'
    }

    if (wordsCharsMapRef.current.get(char)?.includes(index)) return 'correct'

    return 'present'
  }

  const handleCharInput = useCallback(
    (char: string) => {
      if (isWin) return

      setAttempts((cur) => {
        const emptyIndex = cur.current.indexOf('')

        if (emptyIndex === -1) return cur

        const newCurrentAttempt = [...cur.current]
        newCurrentAttempt[emptyIndex] = char

        return {
          ...cur,
          current: newCurrentAttempt,
        }
      })
    },
    [isWin],
  )

  const handleSubmitAttempt = useCallback(() => {
    if (attempts.current.indexOf('') !== -1 || isWin) return

    if (attempts.current.join('') === wordArr.join('')) {
      setIsWin(true)
    }

    setAttempts((cur) => {
      const newSubmitted = [...cur.submitted, cur.current]

      const newCurrent = new Array(wordArr.length).fill('') as string[]

      const newRest = [...cur.rest].slice(0, cur.rest.length - 1)

      return {
        submitted: newSubmitted,
        current: newCurrent,
        rest: newRest,
      }
    })
  }, [attempts, isWin, wordArr])

  const handleDelete = useCallback(() => {
    if (attempts.current.length === 0 || isWin) return

    setAttempts((cur) => {
      let emptyIndex = cur.current.indexOf('')

      if (emptyIndex === -1) {
        emptyIndex = wordArr.length
      }

      const newCurrentAttempt = [...cur.current]
      newCurrentAttempt[emptyIndex - 1] = ''

      return {
        ...cur,
        current: newCurrentAttempt,
      }
    })
  }, [attempts, isWin, wordArr.length])

  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      const isLetter = /^[а-я]$/i.test(event.key)

      if (isLetter) {
        handleCharInput(event.key)
      }

      if (event.key === 'Enter') {
        handleSubmitAttempt()
      }

      if (event.key === 'Backspace') {
        handleDelete()
      }
    }

    addEventListener('keydown', handle)

    return () => {
      removeEventListener('keydown', handle)
    }
  }, [handleCharInput, handleDelete, handleSubmitAttempt])

  return {
    isInited,
    isNoMorePans,
    getTileType,
    attempts,
    handleCharInput,
    isWin,
    handleSubmitAttempt,
    handleDelete,
    todaysPan,
  }
}
