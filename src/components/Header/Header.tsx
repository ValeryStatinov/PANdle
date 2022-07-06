import classnames from 'classnames/bind'
import React from 'react'

import styles from './Header.module.scss'

const cx = classnames.bind(styles)

export const Header = () => {
  return <div className={cx('header')}>PANdle</div>
}
