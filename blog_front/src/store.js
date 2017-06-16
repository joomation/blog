// Redux 관련 불러오기
import { createStore } from 'redux'
import ReduxThunk from 'redux-thunk'

//액션 불러오기
import * as actions from './modules';

// Reducer 불러오기
import modules from './modules';


// 스토어 생성
const store = createStore(modules,ReduxThunk, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

store.dispatch(actions.action());

export default store;