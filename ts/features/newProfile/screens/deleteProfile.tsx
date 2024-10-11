import React, { useState } from "react";
import { Text, View } from "react-native";
import * as O from "fp-ts/lib/Option";
import * as UI from "@pagopa/io-app-design-system";
import { ListItemSwitch } from "@pagopa/io-app-design-system";
import { ActionType, isActionOf } from "typesafe-actions";
import { put, take } from "typed-redux-saga/macro";
import { useIOSelector } from "../../../store/hooks";
import {
  profileEmailSelector,
  profileFiscalCodeSelector,
  profileNameSurnameSelector
} from "../../../store/reducers/profile";
import I18n from "../../../i18n";
import { IOScrollViewWithLargeHeader } from "../../../components/ui/IOScrollViewWithLargeHeader";
import { ContextualHelpPropsMarkdown } from "../../../components/screens/BaseScreenComponent";
import { FAQsCategoriesType } from "../../../utils/faq";
import { useOnFirstRender } from "../../../utils/hooks/useOnFirstRender";
import { loadUserDataProcessing } from "../../../store/actions/userDataProcessing";
import { UserDataProcessingChoiceEnum } from "../../../../definitions/backend/UserDataProcessingChoice";

const NewProfileScreen = () => {
  const profileEmail = useIOSelector(profileEmailSelector);
  const nameSurname = useIOSelector(profileNameSurnameSelector);
  const fiscalCode = useIOSelector(profileFiscalCodeSelector);
  const [isProfileDeletionRequested, setProfileDeletionRequest] =
    useState<boolean>(false);
  const [isProfileDeletionDisabled, setProfileDeletionDisabled] =
    useState<boolean>(false);
  const [isProfileDeletionLoading, setProfileDeletionLoading] =
    useState<boolean>(false);

  useOnFirstRender(() => {
    loadingUserDeletingData();
  });

  function* loadingUserDeletingData() {
    yield* put(
      loadUserDataProcessing.request(UserDataProcessingChoiceEnum.DELETE)
    );

    setProfileDeletionLoading(true);

    const loadingUserDeletionDataResponse = yield* take<
      ActionType<
        | typeof loadUserDataProcessing.success
        | typeof loadUserDataProcessing.failure
      >
    >([loadUserDataProcessing.success, loadUserDataProcessing.failure]);

    if (
      isActionOf(
        loadUserDataProcessing.success,
        loadingUserDeletionDataResponse
      )
    ) {
      setProfileDeletionRequest(
        loadingUserDeletionDataResponse.payload.choice ===
          UserDataProcessingChoiceEnum.DELETE
      );
    } else {
      setProfileDeletionDisabled(true);
    }

    setProfileDeletionLoading(false);
  }

  const FAQ_CATEGORIES: ReadonlyArray<FAQsCategoriesType> = [
    "profile",
    "privacy",
    "authentication_SPID"
  ];

  const contextualHelpMarkdown: ContextualHelpPropsMarkdown = {
    title: "profile.preferences.contextualHelpTitle",
    body: "profile.preferences.contextualHelpContent"
  };

  return (
    <>
      <IOScrollViewWithLargeHeader
        title={{
          label: I18n.t("profile.data.title")
        }}
        description={I18n.t("profile.data.subtitle")}
        headerActionsProp={{ showHelp: true }}
        contextualHelpMarkdown={contextualHelpMarkdown}
        faqCategories={FAQ_CATEGORIES}
      >
        <UI.ContentWrapper>
          {nameSurname && (
            <UI.ListItemInfo
              label={I18n.t("newProfile.nameAndSurname")}
              value={
                <>
                  <View
                    style={{
                      marginTop: 10,
                      flexDirection: "row",
                      gap: 10,
                      alignItems: "center"
                    }}
                  >
                    <UI.Icon name="profile" />
                    <Text>{nameSurname}</Text>
                  </View>
                </>
              }
            />
          )}
        </UI.ContentWrapper>
        <UI.ContentWrapper>
          {fiscalCode && (
            <UI.ListItemInfo
              label={I18n.t("newProfile.fiscalCode")}
              value={
                <>
                  <View
                    style={{
                      marginTop: 10,
                      flexDirection: "row",
                      gap: 10,
                      alignItems: "center"
                    }}
                  >
                    <UI.Icon name="creditCard" />
                    <Text>{fiscalCode}</Text>
                  </View>
                </>
              }
            />
          )}
        </UI.ContentWrapper>
        <UI.ContentWrapper>
          {O.isSome(profileEmail) && (
            <UI.ListItemInfo
              label={I18n.t("newProfile.mail")}
              value={
                <>
                  <View
                    style={{
                      marginTop: 10,
                      flexDirection: "row",
                      gap: 10,
                      alignItems: "center"
                    }}
                  >
                    <UI.Icon name="email" />
                    <Text>{profileEmail.value}</Text>
                  </View>
                </>
              }
            />
          )}
        </UI.ContentWrapper>
        <UI.ContentWrapper>
          {isProfileDeletionLoading && <UI.LoadingSpinner />}
          {!isProfileDeletionLoading && (
            <ListItemSwitch
              label={I18n.t("newProfile.requestProfileDeletion")}
              value={isProfileDeletionRequested}
              disabled={isProfileDeletionDisabled}
            />
          )}
        </UI.ContentWrapper>
      </IOScrollViewWithLargeHeader>
    </>
  );
};

export default NewProfileScreen;
