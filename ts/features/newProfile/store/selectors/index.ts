import { GlobalState } from "../../../../store/reducers/types";

export const newProfileOptInSelector = (state: GlobalState) =>
  state.features.newProfile.enabled ?? false;

export const profileDeletionSelector = (state: GlobalState) =>
  state.features.newProfile.profileDeletionRequest ?? false;
