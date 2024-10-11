import { getType } from "typesafe-actions";
import { PersistConfig, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setNewProfileOptIn, setProfileDeletionRequest } from "../actions";
import { Action } from "../../../../store/actions/types";

export type NewProfileState = {
  enabled: boolean | undefined;
  profileDeletionRequest: boolean | undefined;
};

export const newProfileOptInInitialState: NewProfileState = {
  enabled: undefined,
  profileDeletionRequest: undefined
};

export const newProfileOptInReducer = (
  state: NewProfileState = newProfileOptInInitialState,
  action: Action
): NewProfileState => {
  switch (action.type) {
    case getType(setNewProfileOptIn):
      return {
        ...state,
        enabled: action.payload.enabled
      };
    case getType(setProfileDeletionRequest):
      return {
        ...state,
        profileDeletionRequest: action.payload.profileDeletionRequest
      };
    default:
      return state;
  }
};

const CURRENT_REDUX_OPT_IN_STORE_VERSION = -1;

const persistConfig: PersistConfig = {
  key: "newProfile",
  storage: AsyncStorage,
  version: CURRENT_REDUX_OPT_IN_STORE_VERSION,
  whitelist: ["enabled"]
};

export const newProfileOptInPersistor = persistReducer<NewProfileState, Action>(
  persistConfig,
  newProfileOptInReducer
);
