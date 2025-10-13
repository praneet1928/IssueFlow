import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/types/navigation';
import LoginScreen from './src/screens/(auth)/LoginScreen';
import ForgotScreen from './src/screens/(auth)/ForgotScreen';
import OtpScreen from './src/screens/(auth)/OtpScreen';
import CreatedScreen from './src/screens/(auth)/PasswordCreated';
import Newpassword from './src/screens/(auth)/NewPassword';
import ClientHomeScreen from './src/screens/client/ClientHome';
import NewTicket from './src/screens/client/NewTicket';


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false }} 
        />
        <Stack.Screen name="Forgot" component={ForgotScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Unactive" component={OtpScreen} options={{headerShown: false}}/>
        <Stack.Screen name="PasswordCreated" component={CreatedScreen} options={{headerShown: false}}/>
        <Stack.Screen name="NewPassword" component={Newpassword} options={{headerShown: false}}/>
        <Stack.Screen name="ClientHome" component={ClientHomeScreen} options={{headerShown: false}}/>
        <Stack.Screen name="NewTicket" component={NewTicket} options={{headerShown: false}}/>


      </Stack.Navigator>
    </NavigationContainer>
  );
}