import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

class CartaAjuda extends React.PureComponent {
  static propTypes = {
    card: PropTypes.shape({
      points: PropTypes.number,
      style: PropTypes.string,
    }).isRequired,
  }

  render() {
    return (
      <div className="helpElement">
        <div
          className={classNames('card', this.props.card.style)}
        />
        <div className="helpText">
          Aquesta carta val {this.props.card.points} punt{Math.abs(this.props.card.points) === 1 ? '' : 's'}
        </div>
      </div>
    )
  }
}

export default CartaAjuda
