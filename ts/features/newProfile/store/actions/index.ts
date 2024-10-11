import {
  ActionType,
  createAsyncAction,
  createStandardAction
} from "typesafe-actions";
import { NewProfileState } from "../reducers";
import { UserDataProcessingChoiceEnum } from "../../../../../definitions/backend/UserDataProcessingChoice";
import { UserDataProcessing } from "../../../../../definitions/backend/UserDataProcessing";

export const setNewProfileOptIn = createStandardAction(
  "SET_NEW_PROFILE_LOGIN_OPTIN"
)<Pick<NewProfileState, "enabled">>();

export const setProfileDeletionRequest = createStandardAction(
  "SET_NEW_PROFILE_DELETION_REQUEST"
)<Pick<NewProfileState, "profileDeletionRequest">>();

export const loadUserDataProcessing = createAsyncAction(
  "LOAD_USER_DATA_PROCESSING_REQUEST",
  "LOAD_USER_DATA_PROCESSING_SUCCESS",
  "LOAD_USER_DATA_PROCESSING_FAILURE"
)<
  UserDataProcessingChoiceEnum,
  {
    choice: UserDataProcessingChoiceEnum;
    value?: UserDataProcessing;
  },
  { choice: UserDataProcessingChoiceEnum; error: Error }
>();

export type NewProfileOptInActions = ActionType<
  | typeof setNewProfileOptIn
  | typeof setProfileDeletionRequest
  | typeof loadUserDataProcessing
>;
