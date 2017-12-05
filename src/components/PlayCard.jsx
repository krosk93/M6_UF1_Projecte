import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

function PlayCard({ card }) {
  return (
    <div className={classNames('card', card.style)} />
  )
}

PlayCard.propTypes = {
  card: PropTypes.shape({
    points: PropTypes.number,
    style: PropTypes.string,
  }).isRequired,
}

export default PlayCard
