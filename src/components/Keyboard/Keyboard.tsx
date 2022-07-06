import classnames from 'classnames/bind'
import React from 'react'

import { Key } from './Key'
import styles from './Keyboard.module.scss'

const cx = classnames.bind(styles)

const row1 = ['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ']
const row2 = ['ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э']
const row3 = ['я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю']

type Props = {
  handleCharInput: (char: string) => void
  handleSubmitAttempt: () => void
  handleDelete: () => void
}

export const Keyboard = ({ handleCharInput, handleSubmitAttempt, handleDelete }: Props) => {
  return (
    <div className={cx('container')}>
      <div className={cx('row')}>
        {row1.map((key) => (
          <Key key={key} char={key} onClick={handleCharInput} />
        ))}
      </div>
      <div className={cx('row')}>
        <div className={cx('spacer')} />
        {row2.map((key) => (
          <Key key={key} char={key} onClick={handleCharInput} />
        ))}
        <div className={cx('spacer')} />
      </div>
      <div className={cx('row')}>
        <Key char="enter" onClick={handleSubmitAttempt} className={cx('controlKey')} />
        {row3.map((key) => (
          <Key key={key} char={key} onClick={handleCharInput} />
        ))}
        <Key char="del" onClick={handleDelete} className={cx('controlKey')} />
      </div>
    </div>
  )
}
