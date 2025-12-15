import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoginScreen from './src/screens/(auth)/LoginScreen';
import ForgotScreen from './src/screens/(auth)/ForgotScreen';
import OtpScreen from './src/screens/(auth)/OtpScreen';
import CreatedScreen from './src/screens/(auth)/PasswordCreated';
import Newpassword from './src/screens/(auth)/NewPassword';

import BottomTabs from './src/screens/client/BottomTabs';
import Successfull from './src/screens/client/cards/successfull';

import { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          {/* ---------- AUTH FLOW ---------- */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Forgot" component={ForgotScreen} />
          <Stack.Screen name="Unactive" component={OtpScreen} />
          <Stack.Screen name="PasswordCreated" component={CreatedScreen} />
          <Stack.Screen name="NewPassword" component={Newpassword} />

          {/* ---------- CLIENT APP ---------- */}
          <Stack.Screen name="ClientTabs" component={BottomTabs} />

          {/* ---------- MODAL / OVERLAY ---------- */}
          <Stack.Screen
            name="Successfull"
            component={Successfull}
            options={{ presentation: 'transparentModal' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
