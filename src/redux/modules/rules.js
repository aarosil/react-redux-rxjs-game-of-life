import range from 'lodash/range';
import compact from 'lodash/compact';
import get from 'lodash/get';

const livingNeighborCells = (state, xPos, yPos) => {
  // possible neighbors, clockwise starting in top left
  return compact([
    get(state, (yPos-1)+'.'+(xPos-1)),
    get(state, (yPos-1)+'.'+(xPos)),
    get(state, (yPos-1)+'.'+(xPos+1)),
    get(state, (yPos)+'.'+(xPos+1)),
    get(state, (yPos+1)+'.'+(xPos+1)),
    get(state, (yPos+1)+'.'+(xPos)),
    get(state, (yPos+1)+'.'+(xPos-1)),
    get(state, (yPos)+'.'+(xPos-1)),
  ])
  .reduce((memo, item) => memo += !!item ? 1 : 0, 0);
}

export const generateNextBoard = board =>
  board.map((row, yPos) =>
    row.map((living, xPos) => {
      const neighbors = livingNeighborCells(board, xPos, yPos);
      return living ? (neighbors === 2 || neighbors === 3) : neighbors === 3;
    })
  );

export const toggleCell = (board, xPos, yPos) => [
  ...board.slice(0, yPos),
  [
    ...board[yPos].slice(0,xPos),
    !board[yPos][xPos],
    ...board[yPos].slice(xPos+1)
  ],
  ...board.slice(yPos+1)
]

export const create = (width, height) =>
  range(height)
    .map(row => {
      return range(width)
        .map(cell => false);
    });
