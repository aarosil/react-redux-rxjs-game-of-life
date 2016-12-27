import React, { Component } from 'react';
import GameOfLifeControls from './GameOfLife/GameOfLifeControls';
import GameOfLifeBoard from './GameOfLife/GameOfLifeBoard';

export default class GameOfLifeContainer extends Component {
  render() {
    return (
      <div>
        <div className='gol__nav'>
          <div className='gol__container'>
            <div className='gol__nav--logo'>
              Game of Life
            </div>
          </div>
        </div>
        <div className="gol__container">
          <GameOfLifeControls />
          <GameOfLifeBoard />
        </div>
      </div>
    )
  }
}