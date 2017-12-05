import React from 'react'
import PropTypes from 'prop-types'

import PlayCard from './PlayCard'

function PlayCards({ cards }) {
  return (
    <div>
      {cards.map(card => <PlayCard card={card} />)}
    </div>
  )
}

PlayCards.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.shape({
    points: PropTypes.number,
    style: PropTypes.string,
  })).isRequired,
}

export default PlayCards
