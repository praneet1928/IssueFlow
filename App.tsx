import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import LoginScreen from './src/screens/(auth)/LoginScreen';
import ForgotScreen from './src/screens/(auth)/ForgotScreen';
import OtpScreen from './src/screens/(auth)/OtpScreen';
import CreatedScreen from './src/screens/(auth)/PasswordCreated';
import NewPassword from './src/screens/(auth)/NewPassword';
import PasswordCreated from './src/screens/(auth)/PasswordCreated';
import TicketDetailed from './src/screens/client/cards/TicketDetailed';
import BottomTabs from './src/screens/client/BottomTabs';
import Successfull from './src/screens/client/cards/successfull';
import { TicketProvider } from "./src/context/TicketContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RootStackParamList } from './src/types/navigation';
import ClientProfile from './src/screens/client/ClientProfile';
import ClientSettings from './src/screens/client/ClientSettings';
import ClientNotifications from './src/screens/client/ClientNotifications';
import TermsPrivacy from './src/screens/TermsPrivacy';
import HelpCentre from './src/screens/HelpCentre';
import ReportIssue from './src/screens/ReportIssue';
import ResetPassword from './src/screens/ResetPassword';
import NewTicket from './src/screens/client/cards/NewTicket';
import { NotificationProvider } from "./src/context/NotificationContext";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
  Notifications.requestPermissionsAsync();

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

}, []);  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
  <NotificationProvider>
    <TicketProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          {/* ---------- SETTINGS ---------- */}
          <Stack.Screen name="TermsPrivacy" component={TermsPrivacy} />
          <Stack.Screen name="HelpCentre" component={HelpCentre} />
          <Stack.Screen name="ReportIssue" component={ReportIssue} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />

          {/* ---------- AUTH FLOW ---------- */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Forgot" component={ForgotScreen} />
          <Stack.Screen name="OtpScreen" component={OtpScreen} />
          <Stack.Screen name="PasswordCreated" component={PasswordCreated} />
          <Stack.Screen name="NewPassword" component={NewPassword} />

          {/* ---------- CLIENT APP ---------- */}
          <Stack.Screen name="ClientTabs" component={BottomTabs} />
          <Stack.Screen name="NewTicket" component={NewTicket} />
          <Stack.Screen name="TicketDetailed" component={TicketDetailed} />
          <Stack.Screen name="ClientProfile" component={ClientProfile} />
          <Stack.Screen name="ClientSettings" component={ClientSettings} />
          <Stack.Screen name="ClientNotifications" component={ClientNotifications} />
          

          {/* ---------- MODAL / OVERLAY ---------- */}
          <Stack.Screen
            name="Successfull"
            component={Successfull}
            options={{ presentation: 'transparentModal' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      </TicketProvider>
      </NotificationProvider>
    </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
