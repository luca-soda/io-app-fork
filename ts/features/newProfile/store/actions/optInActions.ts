import { ActionType, createStandardAction } from "typesafe-actions";
import { NewProfileOptInState } from "../reducers/optInReducer";

export const setNewProfileOptIn = createStandardAction(
  "SET_NEW_PROFILE_LOGIN_OPTIN"
)<NewProfileOptInState>();

export type NewProfileActions = ActionType<typeof setNewProfileOptIn>;
