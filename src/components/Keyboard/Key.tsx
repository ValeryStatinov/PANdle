import classnames from 'classnames/bind'
import React from 'react'

import styles from './Key.module.scss'

const cx = classnames.bind(styles)

type Props = {
  char: string
  onClick: (key: string) => void
  className?: string
}

export const Key = ({ char, onClick, className = '' }: Props) => {
  return (
    <button className={cx('key', className)} onClick={() => onClick(char)}>
      {char}
    </button>
  )
}
