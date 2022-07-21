import classnames from 'classnames/bind'
import { Board } from 'components/Board'
import { Header } from 'components/Header'
import { Keyboard } from 'components/Keyboard'
import { WinModal } from 'components/WinModal'
import { useGame } from 'hooks/useGame'
import React from 'react'

import styles from './App.module.scss'

const cx = classnames.bind(styles)

export const App = () => {
  const {
    isInited,
    isNoMorePans,
    isWin,
    getTileType,
    attempts,
    handleCharInput,
    handleSubmitAttempt,
    handleDelete,
    todaysPan,
    isWronglyUsedKey,
  } = useGame()

  return (
    <div className={cx('container')}>
      <Header />
      {isInited ? (
        <div className={cx('content')}>
          {isNoMorePans ? (
            <div>Паны кончились</div>
          ) : (
            <>
              <Board attempts={attempts} getTileType={getTileType} />
              <Keyboard
                handleCharInput={handleCharInput}
                handleSubmitAttempt={handleSubmitAttempt}
                handleDelete={handleDelete}
                isWronglyUsedKey={isWronglyUsedKey}
              />
            </>
          )}
        </div>
      ) : (
        <div>Loading...</div>
      )}
      {isWin && <WinModal todaysPan={todaysPan} attempts={attempts} getTileType={getTileType} />}
    </div>
  )
}
