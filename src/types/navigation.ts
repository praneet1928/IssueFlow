import type { IssueItem } from "../types";
import { NavigatorScreenParams } from "@react-navigation/native";

export type TabParamList = {
  ClientHome: { showToast?: boolean } | undefined;
  ClientHistory: undefined;
};
export type RootStackParamList = {
  Login: undefined;
  App: undefined;
  Forgot: undefined;
  PasswordCreated: undefined;
  NewPassword: undefined;
  NewTicket: undefined;
  Successfull: undefined;
  ClientTabs: NavigatorScreenParams<TabParamList>;
  ClientProfile: undefined;
  TermsPrivacy: undefined;
  HelpCentre: undefined;
  ReportIssue: undefined;
  ClientSettings: undefined;
  TicketDetailed: {issue: IssueItem; };
  Unactive: {email: string};
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}