import {environment} from './../../environments/environment';
/**
 * combineReducers is another useful metareducer that takes a map of reducer
 * functions and creates a new reducer that gathers the values
 * of each reducer and stores them using the reducer's key. Think of it
 * almost like a database, where every reducer is a table in the db.
 *
 * More: https://egghead.io/lessons/javascript-redux-implementing-combinereducers-from-scratch
 */
import {ActionReducer, combineReducers} from '@ngrx/store';
import {routerReducer} from '@ngrx/router-store';
import {usersReducer} from '../user-list/user-list.reducer';
import * as fromUsers from './users';
import * as fromGlobal from './global';
/**
 * The compose function is one of our most handy tools. In basic terms, you give
 * it any number of functions and it returns a function. This new function
 * takes a value and chains it through every composed function, returning
 * the output.
 *
 * More: https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch5.html
 */
import {compose} from '@ngrx/core/compose';
/**
 * storeFreeze prevents state from being mutated. When mutation occurs, an
 * exception will be thrown. This is useful during development mode to
 * ensure that none of the reducers accidentally mutates the state.
 */
import {storeFreeze} from 'ngrx-store-freeze';
/**
 * storeLogger is a metareducer that logs out each time we dispatch an action.
 */
import {storeLogger} from 'ngrx-store-logger';
import {appReducer} from '../app.reducer';


/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface AppState {
	userState: fromUsers.State;
	globalState: fromGlobal.State;
}

const reducers = {
	globalState: appReducer,
	userState: usersReducer,
	router: routerReducer,
};

const developmentReducer: ActionReducer<AppState> = compose(storeFreeze, storeLogger(), combineReducers)(reducers);
const productionReducer: ActionReducer<AppState> = combineReducers(reducers);

export function reducer(state: any, action: any) {
	if (environment.production) {
		return productionReducer(state, action);
	} else {
		return developmentReducer(state, action);
	}
}

/**
 * A selector function is a map function factory. We pass it parameters and it
 * returns a function that maps from the larger state tree into a smaller
 * piece of state. This selector simply selects the `users` state.
 *
 * Selectors are used with the `select` operator.
 *
 * ```ts
 * class MyComponent {
 * 	constructor(state$: Observable<State>) {
 * 	  this.booksState$ = state$.select(getUsersState);
 * 	}
 * }
 * ```
 */
export const getUsersState = (state: AppState) => state.userState.users;

export const getSelectedUserState = (state: AppState) => state.userState.selectedUser;

export const getAuthenticatedState = (state: AppState) => {
	return state.globalState.isAuthenticated;
}
