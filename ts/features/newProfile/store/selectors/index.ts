import * as pot from "@pagopa/ts-commons/lib/pot";
import { GlobalState } from "../../../../store/reducers/types";

export const isNewProfileActiveSelector = (state: GlobalState) =>
  pot.isSome(state.newProfile) && state.newProfile.value.enabled;
