import { ActionType, createStandardAction } from "typesafe-actions";

export const setEnabledNewProfile = createStandardAction(
  "SET_ENABLED_NEW_PROFILE"
)<{ enabled: boolean | undefined }>();

export type EnableNewProfileActions = ActionType<typeof setEnabledNewProfile>;
