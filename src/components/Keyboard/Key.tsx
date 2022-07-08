import classnames from 'classnames/bind'
import React from 'react'

import styles from './Key.module.scss'

const cx = classnames.bind(styles)

type Props = {
  char: string
  onClick: (key: string) => void
  className?: string
  wronglyUsed?: boolean
}

export const Key = ({ char, onClick, className = '', wronglyUsed = false }: Props) => {
  return (
    <button className={cx('key', { key__wrong: wronglyUsed }, className)} onClick={() => onClick(char)}>
      {char}
    </button>
  )
}
