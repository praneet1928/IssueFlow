import type { IssueItem } from "../types";
export type RootStackParamList = {
  Login: undefined;
  App: undefined;
  Forgot: undefined;
  PasswordCreated: undefined;
  NewPassword: undefined;
  ClientHome: undefined;
  NewTicket: undefined;
  Successfull: undefined;
  ClientTabs: undefined;
  TicketDetailed: {issue: IssueItem; };
  Unactive: {email: string};
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}