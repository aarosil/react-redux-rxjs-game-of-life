import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as boardActions from 'redux/modules/gameOfLife';

export class GameOfLifeBoard extends Component {
  componentWillMount() {
    document.addEventListener('mouseup', this.props.boardMouseUp)
    document.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.props.boardMouseUp)
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  handleKeyDown = (e) => {
    if (e.keyCode === 32) {
      e.preventDefault();
      this.props.toggleRunning(!this.props.isRunning);
    }
  }

  render() {
    const { board, boardMouseDown, cellMouseEnter, cellMouseDown } = this.props;
    if (!board) return null;

    return(
      <div className='gol__board--container'>
        <table className='gol__board' onMouseDown={ e => {e.preventDefault(); boardMouseDown()} } >
          <tbody>
          {
            board.map((row, yPos) => (
              <tr key={yPos} className='gol-row'>
                {
                  row.map((cell, xPos) => (
                    <td
                        key={xPos+'-'+yPos}
                        style={{borderTop: yPos === 0 ? '1px solid black' : ''}} // TODO: fix in css
                        className={'gol-cell ' + (board[yPos][xPos] ? 'gol-cell__alive' : '')}
                        onMouseEnter={ e => {e.preventDefault(); cellMouseEnter(xPos,yPos)} }
                        onMouseDown={ e => {e.preventDefault(); cellMouseDown(xPos,yPos)} } />
                  ))
                }
              </tr>
            ))
          }
          </tbody>
        </table>
      </div>
    )
  }
}

const mapStateToProps =  state => {
  const { board, controls: { isRunning } } = state;
  return { board, isRunning };
}

export default connect(mapStateToProps, boardActions)(GameOfLifeBoard);