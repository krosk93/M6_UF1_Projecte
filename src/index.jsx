import React from 'react'
import { render } from 'react-dom'
import Ajuda from './components/Ajuda'
import PlayCards from './components/PlayCards'

/**
 * Limit de punts per defecte
 * @type {Number}
 */
const defaultPoints = 30

/**
 * Limit de tirades per defecte
 * @type {Number}
 */
const defaultThrows = 5

/**
 * Cartes per defecte a l'inici de la partida
 * @type {Number}
 */
const defaultCards = 3

/**
 * Minim de cartes amb les que es pot jugar
 * @type {Number}
 */
const minCards = 3

/**
 * Màxim de cartes amb les que es pot jugar
 * @type {Number}
 */
const maxCards = 5

/*
  Definició de les cartes
  * cards emmagatzema les cartes del joc
    Té dos propietats:
    * style: estil CSS a aplicar
    * points: puntuació de la carta
*/
const cards = [
  {
    style: 'yellow',
    points: 1,
  },
  {
    style: 'blue',
    points: 2,
  },
  {
    style: 'green',
    points: 3,
  },
  {
    style: 'red',
    points: -2,
  },
  {
    style: 'purple',
    points: 5,
  },
]

/**
 * Retorna un objecte card a partir d'un número
 * Empra l'array cards
 * Realitza un mod per a no excedir la longitud de l'array
 * @param  {Number} randomNumber Numero aleatori per a generar la carta
 * @return {Object}              Carta obtinguda a partir del numero aleatori
 */
function convertNumberToCard(randomNumber) {
  return cards[Math.abs(randomNumber) % cards.length]
}

/**
 * Suma els punts aconseguits amb una tirada de cartes
 * @param {Array} thrownCards Array de les cartes tirades
 * @return {Number} Punts aconseguits amb la tirada
 */
function addPoints(thrownCards) {
  let x = 0
  thrownCards.forEach((card) => {
    x += card.points
  })
  return x
}

/**
 * Comprova si la partida ha de finalitzar
 * @param  {String} mode        Mode en que s'està jugant la partida
 * @param  {Number} points      Punts actuals en la partida
 * @param  {Number} throws      Tirades actuals en la partida
 * @param  {Array}  thrownCards Cartes que s'han jugar en la partida actual
 * @return {Boolean}            Retorna true si s'ha de finalitzar la partida,
 *                              false si s'ha de continuar
 */
function checkEndGame(mode, points, throws, thrownCards) {
  if (mode === 'points' && points >= defaultPoints) return true
  else if (mode === 'throws' && throws >= defaultThrows) return true
  else if (thrownCards.every((val, i, arr) => val === arr[0])) return true
  return false
}

/**
 * Element principal de l'aplicació
 * @param  {Object} props
 * @extends React
 */
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      numCards: defaultCards,
      maxPoints: defaultPoints,
      maxThrows: defaultThrows,
      currThrows: 0,
      currPoints: 0,
      endGame: false,
      errors: [],
      thrownCards: [],
      randomNumbers: [],
    }
  }

  /**
   * Mètode que es crida quan es canvia el nombre de cartes
   * @param  {SyntheticEvent} e SyntheticEvent generat per l'acció
   */
  changeNumCards(e) {
    const { value } = e.target
    this.setState({
      numCards: parseInt(value, 10),
    })
  }

  /**
   * Mètode que es crida quan es presiona un dels botons per a jugar
   * @param  {String} mode Mode en que es juga la partida
   */
  pressThrowCards(mode) {
    const { numCards } = this.state
    if (numCards >= minCards && numCards <= maxCards) this.throwCards(mode, numCards)
    else {
      this.setState({
        errors: [
          ...this.state.errors,
          `El número de cartes ha de ser entre ${minCards} i ${maxCards}`,
        ],
      })
    }
  }

  /**
   * Mètode a cridar per a realitzar una tirada
   * @param  {String} pMode    Mode de la partida
   * @param  {Number} numCards Nombre de cartes a tirar
   */
  throwCards(pMode, numCards) {
    const randomNumbers = []
    const thrownCards = []
    for (let i = 0; i < numCards; i += 1) {
      const random = Math.trunc(Math.random() * 1000)
      const card = convertNumberToCard(random)
      randomNumbers.push(random)
      thrownCards.push(card)
    }
    let { currPoints, currThrows, endGame } = this.state
    let mode = pMode
    if (endGame) {
      currPoints = 0
      currThrows = 0
    }
    currPoints += addPoints(thrownCards)
    currThrows += 1
    endGame = checkEndGame(mode, currPoints, currThrows, thrownCards)
    if (endGame) mode = null
    this.setState({
      mode,
      thrownCards,
      randomNumbers,
      currPoints,
      currThrows,
      endGame,
      errors: [],
    })
  }

  endGame() {
    this.setState({
      endGame: true,
    })
    this.restartGame()
  }

  restartGame() {
    this.setState({
      currPoints: 0,
      currThrows: 0,
    })
  }

  render() {
    const { maxPoints, maxThrows, mode } = this.state
    return (
      <div>
        <h1>Joc de les cartes</h1>
        <Ajuda cards={cards} points={maxPoints} throws={maxThrows} />
        <p>
          <label htmlFor="numCartes" className="hideable">
            Número de cartes:
            <input
              type="number"
              id="numCartes"
              onChange={e => this.changeNumCards(e)}
              value={this.state.numCards}
              className="hideable"
              min={minCards}
              max={maxCards}
            />
          </label>
        </p>
        {
          this.state.errors.map(error => <p className="alert">{error}</p>)
        }
        <p>
          {
            mode !== 'throws' && (
              <button onClick={() => this.pressThrowCards('points')} className="hideable">
                {
                  mode === 'points' ? 'Tornar a tirar' : `Jugar fins a ${maxPoints} punts`
                }
              </button>
            )
          }
          {
            mode !== 'points' && (
              <button onClick={() => this.pressThrowCards('throws')} className="hideable">
                {
                  mode === 'throws' ? 'Tornar a tirar' : `Jugar fins a ${maxThrows} tirades`
                }
              </button>
            )
          }
        </p>

        <PlayCards cards={this.state.thrownCards} />
        {
          this.state.thrownCards.length > 0 &&
          <div>
            <p>Els aleatoris generats en aquesta jugada són:
              {this.state.randomNumbers.join(', ')}
            </p>
            <p>Els punts generats en aquesta jugada són:
              {this.state.thrownCards.map(card => card.points).join(', ')}
            </p>
            <p>Número de tirades: {this.state.currThrows}</p>
            <p className="textPoints">PUNTUACIÓ</p>
            <p>Punts tirada:
              {this.state.thrownCards.map(card => card.points).reduce((a, b) => a + b)}
            </p>
            <p>Punts totals: {this.state.currPoints}</p>
            {
              this.state.endGame
              && (
                <h3>
                  PARTIDA FINALITZADA AMB {this.state.currPoints} PUNTS
                  I {this.state.currThrows} TIRADES
                </h3>
              )
            }
          </div>
        }
      </div>
    )
  }
}

render(<App />, document.getElementById('app'))
