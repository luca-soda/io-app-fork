import { getType } from "typesafe-actions";
import { PersistConfig, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setNewProfileOptIn } from "../actions/optInActions";
import { Action } from "../../../../store/actions/types";

export type NewProfileOptInState = {
  enabled: boolean | undefined;
};

export const newProfileOptInInitialState: NewProfileOptInState = {
  enabled: undefined
};

export const newProfileOptInReducer = (
  state: NewProfileOptInState = newProfileOptInInitialState,
  action: Action
): NewProfileOptInState => {
  switch (action.type) {
    case getType(setNewProfileOptIn):
      return {
        ...state,
        enabled: action.payload.enabled
      };
    default:
      return state;
  }
};

const CURRENT_REDUX_OPT_IN_STORE_VERSION = -1;

const persistConfig: PersistConfig = {
  key: "optIn",
  storage: AsyncStorage,
  version: CURRENT_REDUX_OPT_IN_STORE_VERSION,
  whitelist: ["enabled"]
};

export const newProfileOptInPersistor = persistReducer<
  NewProfileOptInState,
  Action
>(persistConfig, newProfileOptInReducer);
