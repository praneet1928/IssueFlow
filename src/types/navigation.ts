export type RootStackParamList = {
  Login: undefined;
  App: undefined;
  Forgot: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}