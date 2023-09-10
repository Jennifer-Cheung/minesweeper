import React, { useEffect, useMemo, useState } from 'react'
import styles from './App.module.scss'
import Tile from './components/Tile.jsx'
import tile from './components/Tile.jsx'

function App () {
  const border = (i) => {
    let borders = []
    if (0 <= i && i <= 8) {
      borders.push('top')
    }
    if ((i + 1) % 9 === 0) {
      borders.push('right')
    }
    if (72 <= i && i <= 80) {
      borders.push('bottom')
    }
    if (i % 9 === 0) {
      borders.push('left')
    }
    return borders
  }

  const [tiles, setTiles] = useState([]) // Array of tiles
  const [areTilesRevealed, setAreTilesRevealed] = useState([]) // Array of isRevealed of all tiles
  const [mines, setMines] = useState([])
  const [tileNumbers, setTileNumbers] = useState([])
  const [hasStarted, setHasStarted] = useState(false)
  const [areTilesFlagged, setAreTilesFlagged] = useState([])
  const [result, setResult] = useState(undefined)

  const revealTiles = (indices) => {
    let tempAreTilesRevealed = [...areTilesRevealed]
    indices.forEach(i => {tempAreTilesRevealed[i] = true})
    setAreTilesRevealed(tempAreTilesRevealed)
  }

  const uncoverSpace = (i, tilesToBeRevealed, tileNums) => {
    if (0 <= i && i <= 80 && !(tilesToBeRevealed.includes(i))) {
      tilesToBeRevealed.push(i)

      if (tileNums[i] === 0) {
        if (!(border(i).includes('top'))) {
          console.log('Searches top tile no. ' + (i - 9))
          uncoverSpace(i - 9, tilesToBeRevealed, tileNums)
        }
        if (!(border(i).includes('right'))) {
          console.log('Searches right tile no. ' + (i + 1))
          uncoverSpace(i + 1, tilesToBeRevealed, tileNums)
        }
        if (!(border(i).includes('bottom'))) {
          console.log('Searches bottom tile no. ' + (i + 9))
          uncoverSpace(i + 9, tilesToBeRevealed, tileNums)
        }
        if (!(border(i).includes('left'))) {
          console.log('Searches left tile no. ' + (i - 1))
          uncoverSpace(i - 1, tilesToBeRevealed, tileNums)
        }
        if (!(border(i).includes('left')) && !(border(i).includes('top'))) {
          uncoverSpace(i - 10, tilesToBeRevealed, tileNums)
        }
        if (!(border(i).includes('right')) && !(border(i).includes('top'))) {
          uncoverSpace(i - 8, tilesToBeRevealed, tileNums)
        }
        if (!(border(i).includes('left')) && !(border(i).includes('bottom'))) {
          uncoverSpace(i + 8, tilesToBeRevealed, tileNums)
        }
        if (!(border(i).includes('right')) && !(border(i).includes('bottom'))) {
          uncoverSpace(i + 10, tilesToBeRevealed, tileNums)
        }
      }
    }
  }

  const generateMinefield = (i) => {
    /* Generates random mines on map */
    let tempMines = [] // Tiles with mines
    while (tempMines.length < 10) {
      let randomNum = Math.ceil(Math.random() * 81)
      const tilesWithNoMines = [i, i-10, i-9, i-8, i-1, i+1, i+8, i+9, i+10]
      if (!tempMines.includes(randomNum) && !(tilesWithNoMines.includes(randomNum))) {
        tempMines.push(randomNum)
      }
    }
    console.log('Mines are: ' + tempMines)

    /* Generates displayed numbers on tiles */
    let tempTileNumbers = []
    for (let i = 0; i < 81; i++) {
      let returnNumber = 0
      if (!tempMines.includes(i)) {
        let indicesOfTilesAround = [i-10, i-9, i-8, i-1, i+1, i+8, i+9, i+10]
        if ((border(i).includes('top'))) {
          indicesOfTilesAround = indicesOfTilesAround.filter(
            (item) => item !== i-10 && item !== i-9 && item !== i-8
          )
        }
        if ((border(i).includes('right'))) {
          indicesOfTilesAround = indicesOfTilesAround.filter(
            (item) => item !== i-8 && item !== i+1 && item !== i+10
          )
        }
        if ((border(i).includes('bottom'))) {
          indicesOfTilesAround = indicesOfTilesAround.filter(
            (item) => item !== i+8 && item !== i+9 && item !== i+10
          )
        }
        if ((border(i).includes('left'))) {
          indicesOfTilesAround = indicesOfTilesAround.filter(
            (item) => item !== i-10 && item !== i-1 && item !== i+8
          )
        }
        indicesOfTilesAround.forEach((item) => {
          if (tempMines.includes(item)) {
            returnNumber++
          }
        })
      }
      tempTileNumbers.push(returnNumber)
    }

    let tilesToBeRevealed = []
    console.log(tempTileNumbers)
    uncoverSpace(i, tilesToBeRevealed, tempTileNumbers)
    console.log('Tiles to be revealed: ' + tilesToBeRevealed)
    revealTiles(tilesToBeRevealed)

    setMines(tempMines)
    setTileNumbers(tempTileNumbers)
  }

  const hasWon = () => {
    const leftTiles = areTilesRevealed.filter((tile, index) => !areTilesFlagged[index])
    console.log(leftTiles)
    let win = true
    leftTiles.forEach(tile => {win = win && tile})
    return win
  }

  /* OnClick function for <Tile> */
  const tileOnCLick = (i) => {
    if (result === undefined) {
      console.log('Tile no. ' + i + ' is clicked')
      if (!hasStarted) {
        generateMinefield(i)
        setHasStarted(true)
      } else {
        if (!mines.includes(i)) {
          let tilesToBeRevealed = []
          uncoverSpace(i, tilesToBeRevealed, tileNumbers)
          console.log(tilesToBeRevealed)
          revealTiles(tilesToBeRevealed)
        } else {
          revealTiles([i])
          setResult('lose')
        }
      }
    }
  }

  const tileOnContextMenu = (e, i) => {
    if (result === undefined) {
      e.preventDefault()
      let tempAreTilesFlagged = [...areTilesFlagged]
      tempAreTilesFlagged[i] = !tempAreTilesFlagged[i]
      setAreTilesFlagged(tempAreTilesFlagged)
      if (hasWon()) {
        setResult('win')
      }
    }
  }

  /* Renders minefield (setting up tiles, revealing tiles) */
  useEffect(() => {
    let newTiles = []
    for (let i = 0; i < 81; i++) {
      newTiles.push(
        <Tile
          key={i}
          onClick={() => {tileOnCLick(i)}}
          onContextMenu={(e) => {tileOnContextMenu(e, i)}}
          isMine={mines.includes(i)}
          isRevealed={areTilesRevealed[i]}
          isFlagged={areTilesFlagged[i]}
        >
          {
            tileNumbers[i]
          }
        </Tile>
      )
    }
    setTiles(newTiles)
  }, [areTilesRevealed, areTilesFlagged])

  /* Fills areTilesRevealed and areTilesFlagged by false */
  useEffect(() => {
    let tempArr = []
    for (let i = 0; i < 81; i++) {
      tempArr.push(false)
    }
    setAreTilesRevealed(tempArr)
    setAreTilesFlagged(tempArr)
  }, [])

  return (
    <div className={styles.app}>
      {/* Title container */}
      <div>
        <h1>Minesweeper</h1>
      </div>

      {/* Minefield */}
      <div className={styles.minefield}>
        {tiles}
      </div>

      {/* Result */}
      <p>
        {
          result === 'lose' ?
            'You lost! :(' :
            (hasWon()) ?
              'You won! :)' :
              ''
        }
      </p>
    </div>
  )
}

export default App
