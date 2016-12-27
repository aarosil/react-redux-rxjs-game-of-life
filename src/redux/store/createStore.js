import { createStore as _createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';

import { gameOfLifeReducer, gameOfLifeEpic } from 'redux/modules/gameOfLife';

let store;

export default function createStore() {
  if (store) return store;

  const middleware = [createEpicMiddleware(gameOfLifeEpic)];
  const enhancer = applyMiddleware(...middleware);
  store = _createStore(gameOfLifeReducer, {}, enhancer);

  return store;

}
