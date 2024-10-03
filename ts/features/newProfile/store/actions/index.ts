/**
 * Action types and action creator related to the Profile.
 */

import {
  ActionType,
  createAction,
  createStandardAction
} from "typesafe-actions";
import { InitializedProfile } from "../../../../../definitions/backend/InitializedProfile";

export const resetProfileState = createStandardAction(
  "NEW_RESET_PROFILE_STATE"
)();

export const profileLoadRequest = createStandardAction(
  "NEW_PROFILE_LOAD_REQUEST"
)();
export const profileLoadSuccess = createStandardAction(
  "NEW_PROFILE_LOAD_SUCCESS"
)<InitializedProfile>();

export const profileLoadFailure = createAction(
  "NEW_PROFILE_LOAD_FAILURE",
  resolve => (error: Error) => resolve(error, { error: true })
);

export type NewProfileActions =
  | ActionType<typeof resetProfileState>
  | ActionType<typeof profileLoadSuccess>
  | ActionType<typeof profileLoadRequest>
  | ActionType<typeof profileLoadFailure>;
