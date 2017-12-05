import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import CartaAjuda from './CartaAjuda'

export default class Ajuda extends React.Component {
  static propTypes = {
    cards: PropTypes.arrayOf(PropTypes.shape({
      points: PropTypes.number,
      style: PropTypes.string,
    })).isRequired,
    points: PropTypes.number,
    throws: PropTypes.number,
  }

  static defaultProps = {
    points: 30,
    throws: 5,
  }

  constructor(props) {
    super(props)
    this.state = {
      open: false,
    }
    this.toggleHelp = this.toggleHelp.bind(this)
  }

  toggleHelp() {
    this.setState({
      open: !this.state.open,
    })
  }

  render() {
    return (
      <div>
        <div className={classNames({ help: true, invisible: !this.state.open })}>
          <p>El funcionament del joc és simple:</p>
          <ul>
            <li>Tries un nombre de cartes</li>
            <li>Prems el botó del mode de joc que desitgis</li>
            <li>Torna a prémer el botó per a tornar a tirar fins a acabar la partida</li>
          </ul>
          <p>Les normes del joc:</p>
          <ul>
            <li>
              Si jugues a tirades, en quant arribis a {this.props.throws} s&#39;acabarà el joc
            </li>
            <li>
              Si jugues a punts,
              en quant arribis o superis {this.props.points} punts s&#39;acabarà el joc
            </li>
            <li>
              El joc també pot acabar si totes les cartes resultants d&#39;una tirada son iguals
            </li>
          </ul>
          {this.props.cards.map(card => <CartaAjuda card={card} key={card.style} />)}
        </div>
        <p><button onClick={this.toggleHelp}>{this.state.open ? 'Ocultar' : 'Mostrar'} ajuda</button></p>
      </div>
    )
  }
}
