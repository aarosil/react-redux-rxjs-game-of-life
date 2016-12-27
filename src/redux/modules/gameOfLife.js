import * as boardUtil from './rules';
import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs';
import isEqual from 'lodash/isEqual';

const INITIALIZE            = '@@ams-gameoflife/INITIALIZE';
const SET_BOARD_DIMENSIONS  = '@@ams-gameoflife/SET_BOARD_DIMENSIONS';
const SET_INTERVAL          = '@@ams-gameoflife/SET_INTERVAL';
const TOGGLE_CELL_STATE     = '@@ams-gameoflife/TOGGLE_CELL_STATE';
const PROCEED_GAME          = '@@ams-gameoflife/PROCEED_GAME';
const UPDATE_BOARD          = '@@ams-gameoflife/UPDATE_BOARD';
const BOARD_MOUSEUP         = '@@ams-gameoflife/BOARD_MOUSEUP';
const BOARD_MOUSEDOWN       = '@@ams-gameoflife/BOARD_MOUSEDOWN';
const CELL_MOUSEENTER       = '@@ams-gameoflife/CELL_MOUSEENTER';
const CELL_MOUSEDOWN        = '@@ams-gameoflife/CELL_MOUSEDOWN';
const TOGGLE_RUNNING        = '@@ams-gameoflife/TOGGLE_RUNNING';

export function boardReducer(state = [], action) {
  switch(action.type) {
    case INITIALIZE:
      return boardUtil.create(action.width, action.height);
    case TOGGLE_CELL_STATE:
      return boardUtil.toggleCell(state, action.xPos, action.yPos);
    case UPDATE_BOARD:
      return action.board;
    default:
      return state;
  }
}

const initialControls = {
  interval: 100,
  width: 30,
  height: 15
}

export function controlsReducer(state = initialControls, action) {
  switch(action.type) {
    case SET_BOARD_DIMENSIONS:
      return {...state, ...action.dimensions};
    case SET_INTERVAL:
      return {...state, interval: action.interval}
    case TOGGLE_RUNNING:
      return {...state, isRunning: action.isRunning};
    default:
      return state;
  }
}

// Game Control Actions
export const toggleRunning = isRunning =>
  ({type: TOGGLE_RUNNING, isRunning});
const setDimensions = dimensions =>
  ({type: SET_BOARD_DIMENSIONS, dimensions});
export const setWidth = width => setDimensions({width});
export const setHeight = height => setDimensions({height});
export const setInterval = interval =>
  ({type: SET_INTERVAL, interval});

// Board / Cell State Actions
export const proceedGame = () =>
  ({type: PROCEED_GAME});
export const initializeBoard = (width, height) =>
  ({ type: INITIALIZE, width, height });

// Cell Selection Actions
export const boardMouseDown = () =>
  ({ type: BOARD_MOUSEDOWN });
export const boardMouseUp = () =>
  ({ type: BOARD_MOUSEUP });
export const cellMouseEnter = (xPos, yPos) =>
  ({ type: CELL_MOUSEENTER, xPos, yPos });
export const cellMouseDown = (xPos, yPos) =>
  ({ type: CELL_MOUSEDOWN, xPos, yPos });

// Epics
const runWithDynamicIntervalEpic = (action$, store) => {
  const toggleAction$   = action$.ofType(TOGGLE_RUNNING);
  const startAction$    = toggleAction$.filter(({isRunning}) => isRunning)
  const stopAction$     = toggleAction$.filter(({isRunning}) => !isRunning);
  const intervalChange$ = action$.ofType(SET_INTERVAL);

  return startAction$
    .switchMap(() =>
      intervalChange$
        .debounceTime(100)
        .startWith({interval: store.getState().controls.interval})
        .switchMap( ({interval}) =>
          Observable.timer(0, interval)
            .mapTo({type: PROCEED_GAME})
        )
        .takeUntil(stopAction$)
    );
}

const updateBoardEpic = (action$, store) =>
  action$.ofType(PROCEED_GAME)
    .map(() => {
      const currentBoard = store.getState().board;
      const newBoard = boardUtil.generateNextBoard(currentBoard);
      return isEqual(newBoard, currentBoard) // stop game if stable state
        ? { type: TOGGLE_RUNNING, isRunning: false }
        : { type: UPDATE_BOARD, board: newBoard }
    });

const toggleCellEpic = action$ =>
  action$.ofType(CELL_MOUSEDOWN)
    .map( ({xPos, yPos}) => ({ type: TOGGLE_CELL_STATE, xPos, yPos }) )

const dragToggleCellsEpic = action$ =>
  action$.ofType(BOARD_MOUSEDOWN)
    .flatMap( action =>
      action$.ofType(CELL_MOUSEENTER)
        .map( ({xPos, yPos}) => ({ type: TOGGLE_CELL_STATE, xPos, yPos }) )
        .takeUntil(action$.ofType(BOARD_MOUSEUP))
    );

// Root Reducer and Epic
export const gameOfLifeReducer = combineReducers({
  controls: controlsReducer,
  board: boardReducer
});

export const gameOfLifeEpic = combineEpics(
  runWithDynamicIntervalEpic,
  updateBoardEpic,
  toggleCellEpic,
  dragToggleCellsEpic
);
