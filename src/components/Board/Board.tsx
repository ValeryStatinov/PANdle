import classnames from 'classnames/bind'
import { Attempts, TileType } from 'hooks/useGame'
import React, { useEffect, useRef, useState } from 'react'

import styles from './Board.module.scss'

const cx = classnames.bind(styles)

type Props = {
  attempts: Attempts
  getTileType: (char: string, index: number) => TileType
}

export const Board = ({ attempts, getTileType }: Props) => {
  const firstTileRef = useRef<HTMLDivElement | null>(null)
  const [tileWidth, setTileWidth] = useState(0)

  useEffect(() => {
    if (!firstTileRef.current) return

    setTileWidth(firstTileRef.current.getBoundingClientRect().width)
  }, [])

  return (
    <div className={cx('container')}>
      {attempts.submitted.map((attempt, i) => (
        <div className={cx('attempt')} key={i}>
          {attempt.map((char, i) => {
            const tileType = getTileType(char, i)

            return (
              <div key={i} className={cx('tile', `tile__${tileType}`, 'tile__open')} style={{ height: tileWidth }}>
                {char}
              </div>
            )
          })}
        </div>
      ))}

      <div className={cx('attempt')}>
        {attempts.current.map((char, i) => (
          <div key={i} className={cx('tile')} style={{ height: tileWidth }} ref={i === 0 ? firstTileRef : undefined}>
            {char}
          </div>
        ))}
      </div>

      {attempts.rest.map((attempt, i) => (
        <div className={cx('attempt')} key={i}>
          {attempt.map((_, i) => (
            <div key={i} className={cx('tile')} style={{ height: tileWidth }} />
          ))}
        </div>
      ))}
    </div>
  )
}
