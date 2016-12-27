import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as gameActions from 'redux/modules/gameOfLife';
import SliderInput from 'components/SliderInput';
import ToggleInput from 'components/ToggleInput';

export class GameOfLifeControls extends Component {
  componentDidMount() {
    this.handleCreate();
  }

  handleCreate = () => {
    const { width, height } = this.props;
    this.props.initializeBoard(width, height);
  }

  render() {
    const { width, height, board, isRunning, interval, setInterval } = this.props;
    return (
      <div>
        <div className='gol__controls'>
          <span className='gol__controls-label'>board: </span>
          <div className='gol__controls--element'>
            <input className='gol__input-dims' type='number' value={width} onChange={ e => this.props.setWidth(e.target.value) } />  w &#215;
            {' '}
            <input className='gol__input-dims' type='number'value={height} onChange={ e => this.props.setHeight(e.target.value) } /> h
          </div>
          <div className='gol__controls--element'>
            <button onClick={this.handleCreate}>
              <span>create board</span>
            </button>
          </div>
        </div>
        <div>
          <span className='gol__controls-label'>controls: </span>
          <button
              className='gol__run-game-button'
              disabled={!board.length}
              onClick={ e => this.props.toggleRunning(!isRunning) }>
            <span>{isRunning ? 'Stop' :'Run Game'}</span>
          </button>
          <button
              className='gol__run-game-button'
              disabled={!board.length || isRunning}
              onClick={ e => this.props.proceedGame() }>
            <span>Next Generation</span>
          </button>
          <span>use spacebar to start/stop</span>
        </div>
        <div className='gol__controls'>
          <span className='gol__controls-label'>speed: </span>
          <SliderInput
              onChange={setInterval}
              minVal={600}
              maxVal={0}
              value={interval} />
          <ToggleInput 
              onChange={setInterval}
              minVal={600}
              maxVal={0}
              value={interval} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { controls: {width, height, isRunning, interval}, board } = state;
  return { width, height, isRunning, board, interval };
}

export default connect(mapStateToProps, gameActions)(GameOfLifeControls);