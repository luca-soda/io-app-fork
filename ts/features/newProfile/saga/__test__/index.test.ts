/* eslint-disable functional/no-let */

import * as E from "fp-ts/lib/Either";
import { call, put } from "typed-redux-saga/macro";
import { runSaga } from "redux-saga";
import { IPatternStringTag } from "@pagopa/ts-commons/lib/strings";
import { convertUnknownToError } from "../../../../utils/errors";
import { BackendClient } from "../../../../api/backend";
import {
  profileLoadSuccess,
  profileLoadFailure
} from "../../../../store/actions/profile";
import { InitializedProfile } from "../../../../../definitions/backend/InitializedProfile";
import { ServicesPreferencesModeEnum } from "../../../../../definitions/backend/ServicesPreferencesMode";

export function* loadNewProfile(getNewProfile: BackendClient["getNewProfile"]) {
  try {
    const response = yield* call(getNewProfile, {});

    if (E.isLeft(response)) {
      throw new Error("Something went wrong");
    }

    if (response.right.status === 200) {
      const responseData = response.right.value;

      const newProfileData: typeof response.right.value = {
        is_inbox_enabled: responseData.is_inbox_enabled,
        is_email_enabled: responseData.is_email_enabled,
        is_webhook_enabled: responseData.is_webhook_enabled,
        family_name: responseData.family_name,
        fiscal_code: responseData.fiscal_code,
        has_profile: responseData.has_profile,
        name: responseData.name,
        service_preferences_settings: responseData.service_preferences_settings,
        version: responseData.version
      };

      yield* put(profileLoadSuccess(newProfileData));
    }
  } catch (error) {
    yield* put(profileLoadFailure(convertUnknownToError(error)));
  }
}

describe("loadNewProfile", () => {
  it("should handle successful profile load", async () => {
    let dispatched: Array<any> = [];
    const mockProfile: InitializedProfile = {
      is_inbox_enabled: true,
      is_email_enabled: true,
      is_webhook_enabled: true,
      family_name: "Mario",
      fiscal_code: "RSSMRA81R10H501E" as string &
        IPatternStringTag<"^[A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST][0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{3}[A-Z]$">,
      has_profile: true,
      name: "Rossi",
      service_preferences_settings: {
        mode: ServicesPreferencesModeEnum.AUTO
      },
      version: 1
    };

    const mockGetNewProfile = jest
      .fn()
      .mockResolvedValue(E.right({ status: 200, value: mockProfile }));

    await runSaga(
      {
        dispatch: action => (dispatched = [action])
      },
      loadNewProfile,
      mockGetNewProfile
    ).toPromise();

    expect(dispatched).toContainEqual(profileLoadSuccess(mockProfile));
  });

  it("should handle profile load failure due to API error", async () => {
    let dispatched: Array<any> = [];
    const mockError = new Error("Something went wrong");

    const mockGetNewProfile = jest.fn().mockResolvedValue(E.left(mockError));

    await runSaga(
      {
        dispatch: action => (dispatched = [action])
      },
      loadNewProfile,
      mockGetNewProfile
    ).toPromise();

    expect(dispatched).toContainEqual(
      profileLoadFailure(convertUnknownToError(mockError))
    );
  });

  it("should handle profile load failure due to non-200 status", async () => {
    let dispatched: Array<any> = [];
    const mockResponse = { status: 500, value: {} };

    const mockGetNewProfile = jest.fn().mockResolvedValue(E.left(mockResponse));

    await runSaga(
      {
        dispatch: action => (dispatched = [action])
      },
      loadNewProfile,
      mockGetNewProfile
    ).toPromise();

    expect(dispatched).toContainEqual(
      profileLoadFailure(new Error("Something went wrong"))
    );
    // expect(dispatched).toContain((element: any) => element.type === "PROFILE_LOAD_FAILURE");
  });
});
