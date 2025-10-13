import React, { useState } from 'react';
import {Text, StyleSheet, View, Pressable, TextInput, TouchableWithoutFeedback, Keyboard} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from '../../types/navigation';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Lock from "../../../assets/images/lock.svg";

type NavigationProp = StackNavigationProp<RootStackParamList, 'Forgot'>;

const ForgotPassword: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
  const normalizedEmail = email.toLowerCase();
  const isFormValid = isValidEmail(normalizedEmail);

  const handleForgot = async () => {
    if (!isFormValid) {
      setError('Please enter a valid email');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      // TODO: call your API to send OTP
      // await api.sendOtp({ email: normalizedEmail });
		Keyboard.dismiss();               
  		await new Promise(r => setTimeout(r, 120)); 
      navigation.navigate('Unactive', { email: normalizedEmail });
    } catch (e) {
      setError('Failed to send code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.forgotPassword}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        extraScrollHeight={380}
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.view}>
            <View style={{marginLeft: 10}}>
              <View style={[styles.lockIcons, styles.symbolsLayout]}>
                <Lock style={[styles.lockIconsChild, styles.topAppBarLayout]} width={64} height={64} />
              </View>
              <Text style={styles.troubleLoggingIn}>{`Trouble logging in? `}</Text>
              <Text style={styles.wellSendA}>{`We'll send a code to your email to reset your password`}</Text>
            </View>

            <View style={{alignItems: 'center', height: '100%'}}>
              <View style={[styles.userContainer, { borderColor: error ? '#D92D20' : '#CED6E0' }]}>
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor="#A0A0A0"
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    if (error) setError(null);
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  returnKeyType="done"
                />
              </View>
              {!!error && (
                <Text style={{ color: '#D92D20', marginTop: 8, alignSelf: 'center' }}>{error}</Text>
              )}

              <View style={styles.bottom}>
                <Text style={[styles.lockIconsPosition]}>
                  <Text style={styles.rememberYourPassword}>{`Remember your password? `}</Text>
                  <Text onPress={handleLogin} style={styles.login}>Login</Text>
                </Text>
              </View>

              <View style={{alignItems: 'center', width: '100%', marginTop: '20%', flexGrow: 1}}>
                <Pressable
                  style={[styles.loginButton, (!isFormValid || loading) && styles.loginButtonDisabled]}
                  onPress={handleForgot}
                  disabled={!isFormValid || loading}
                >
                  <Text style={[styles.loginButtonText, (!isFormValid || loading) && styles.loginButtonTextDisabled]}>
                    {loading ? 'Sending...' : 'Submit'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  forgotPassword: {
    backgroundColor: "#ffffffff",
    width: "100%",
    alignItems: 'center',
    flexGrow: 1,
  },
  container: {
    height: '100%',
    width: '100%',
    padding: 10,
    backgroundColor: '#ffffffff',
  },
  topAppBarLayout: { height: 64, position: "absolute" },
  symbolsLayout: { width: 68, overflow: "hidden" },
  lockIconsPosition: { alignItems: 'center', position: "absolute" },
  view: { width: "100%", height: "100%", backgroundColor: "#ffffffff" },
  troubleLoggingIn: {
    top: 196, fontSize: 24, color: "#081A41", textAlign: "left", letterSpacing: 0.1,
    fontFamily: "Poppins-Regular", fontWeight: "500", position: "absolute"
  },
  wellSendA: {
    top: 235, color: "#4b4b4b", width: 360, letterSpacing: 0.1, display: "flex",
    fontFamily: "Poppins-Regular", fontSize: 14, textAlign: "left", position: "absolute"
  },
  lockIcons: { top: 110, height: 68, position: "absolute" },
  lockIconsChild: { top: 2, left: 2, width: 64 },
  rememberYourPassword: { color: "#a0a0a0", letterSpacing: 0.1, fontFamily: "Poppins-Regular", overflow: "hidden" },
  login: { color: "#1a56d9" },
  loginButton: {
    width: '95%', height: '28%', flexDirection: 'row', backgroundColor: '#0D2B6C',
    justifyContent: 'center', alignItems: 'center', borderRadius: 14,
  },
  loginButtonDisabled: { backgroundColor: '#6C849D1F' },
  loginButtonTextDisabled: { color: '#A0A0A0' },
  loginButtonText: {
    fontFamily: 'Poppins-Regular', color: '#FAFBFC', letterSpacing: 0.1, fontSize: 18, fontWeight: '500',
  },
  userContainer: {
    width: '95%', height: '7%', borderWidth: 1, color: '#A0A0A0', borderColor: '#CED6E0',
    borderRadius: 14, flexDirection: 'row', marginTop: '75%', alignItems: 'center',
  },
  input: {
    fontFamily: 'Poppins-Regular', paddingHorizontal: 20, fontSize: 16, letterSpacing: 0.1,
    height: '100%', color: '#000', flex: 1,
  },
  bottom: { width: '100%', marginTop: '85%', marginBottom: '-10%', alignItems: 'center' },
});

export default ForgotPassword;