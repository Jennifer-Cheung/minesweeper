import React from 'react'
import styles from './Tile.module.scss'

const Tile = ({ isMine, isRevealed, onClick, onContextMenu, children, isFlagged }) => {
  return (
    <div
      className={
      styles.tile + ' ' +
      (isRevealed ? (isMine ? styles.mine : styles.space) : (isFlagged ? styles.flagged : styles.notRevealed))
    }
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      {isRevealed && children !== 0 ? children : ''}
    </div>
  )
}

export default Tile
