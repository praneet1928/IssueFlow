export type RootStackParamList = {
  Login: undefined;
  App: undefined;
  Forgot: undefined;
  PasswordCreated: undefined;
  NewPassword: undefined;
  ClientHome: undefined;
  NewTicket: undefined;
  Unactive: {email: string};
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}