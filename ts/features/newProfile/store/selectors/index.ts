import { GlobalState } from "../../../../store/reducers/types";

export const newProfileOptInSelector = (state: GlobalState) =>
  state.features.newProfile.enabled ?? false;
