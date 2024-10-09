import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import { call, put } from "typed-redux-saga/macro";
import { BackendClient } from "../../../api/backend";
import { withRefreshApiCall } from "../../../features/fastLogin/saga/utils";
import I18n from "../../../i18n";
import {
  profileLoadFailure,
  profileLoadSuccess
} from "../../../store/actions/profile";
import { ReduxSagaEffect, SagaCallReturnType } from "../../../types/utils";
import { convertUnknownToError } from "../../../utils/errors";
import { readablePrivacyReport } from "../../../utils/reporters";
import { InitializedProfile } from "../../../../definitions/backend/InitializedProfile";

// A saga to load the Profile.
export function* loadProfile(
  getNewProfile: ReturnType<typeof BackendClient>["getNewProfile"]
): Generator<
  ReduxSagaEffect,
  O.Option<InitializedProfile>,
  SagaCallReturnType<typeof getNewProfile>
> {
  try {
    const response = (yield* call(
      withRefreshApiCall,
      getNewProfile({})
    )) as unknown as SagaCallReturnType<typeof getNewProfile>;
    // we got an error, throw it
    if (E.isLeft(response)) {
      throw Error(readablePrivacyReport(response.left));
    }
    if (response.right.status === 200) {
      // Ok we got a valid response, send a SESSION_LOAD_SUCCESS action
      // BEWARE: we need to cast to UserProfileUnion to make UserProfile a
      // discriminated union!

      yield* put(
        profileLoadSuccess(response.right.value as InitializedProfile)
      );
      return O.some(response.right.value);
    }
    throw response
      ? Error(`response status ${response.right.status}`)
      : Error(I18n.t("profile.errors.load"));
  } catch (e) {
    yield* put(profileLoadFailure(convertUnknownToError(e)));
  }
  return O.none;
}
