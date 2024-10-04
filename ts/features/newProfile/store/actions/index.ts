/**
 * Action types and action creator related to the Profile.
 */

import {
  ActionType,
  createAction,
  createStandardAction
} from "typesafe-actions";
import { InitializedNewProfile } from "../reducers";

export const resetProfileState = createStandardAction(
  "NEW_RESET_PROFILE_STATE"
)();

export const profileLoadRequest = createStandardAction(
  "NEW_PROFILE_LOAD_REQUEST"
)();
export const profileLoadSuccess = createStandardAction(
  "NEW_PROFILE_LOAD_SUCCESS"
)<InitializedNewProfile>();

export const profileLoadFailure = createAction(
  "NEW_PROFILE_LOAD_FAILURE",
  resolve => (error: Error) => resolve(error, { error: true })
);

export type NewProfileActions =
  | ActionType<typeof resetProfileState>
  | ActionType<typeof profileLoadSuccess>
  | ActionType<typeof profileLoadRequest>
  | ActionType<typeof profileLoadFailure>;
