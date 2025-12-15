import React, { useState, useEffect } from 'react';
import { RootStackParamList } from '../../types/navigation';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  View,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import Issueflow from "../../../assets/images/issueflow.svg";
import { SafeAreaView } from 'react-native-safe-area-context';

type NavigationProp = {
  navigate: (screen: keyof RootStackParamList) => void;
};

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const isFormValid = email.length > 0 && password.length > 0;

  const handleLogin = async() => {
    if (isFormValid) {
      console.log('Logging in with:', { email, password });
      Keyboard.dismiss();
      await new Promise(r => setTimeout(r, 120));
      navigation.navigate('ClientTabs');
    }
  };

  const handleforgot = async() => {
    Keyboard.dismiss();
    await new Promise(r => setTimeout(r, 120));
    navigation.navigate('Forgot');
  };

  const handleTerms = () => setShowTerms(true);
  const handlePrivacy = () => setShowPrivacy(true);
  const closeModals = () => {
    setShowTerms(false);
    setShowPrivacy(false);
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.total}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        extraScrollHeight={360}
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ alignItems: 'center' }}>
            <View style={styles.logo}>
              <Issueflow width={'90%'} height={'90%'} />
            </View>

            <View style={styles.main}>
              <Text style={[styles.subtitle]}>Login to your account</Text>

              <View style={styles.userContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Employee ID or email address"
                  placeholderTextColor="#A0A0A0"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Password"
                  placeholderTextColor="#A0A0A0"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!passwordVisible}
                />
                <TouchableOpacity
                  onPress={() => setPasswordVisible(!passwordVisible)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={passwordVisible ? 'eye-outline' : 'eye-off-outline'}
                    size={19}
                    color='#CED6E0'
                  />
                </TouchableOpacity>
              </View>

              <Pressable style={styles.forgot} onPress={handleforgot}>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </Pressable>
            </View>

            <View style={styles.bottom}>
              <Text style={styles.footerText}>
                By signing up via your social profile or by email you agree with IssueFlow's
                <Text style={styles.linkText} onPress={handleTerms}> Terms & Conditions</Text> and
                <Text style={styles.linkText} onPress={handlePrivacy}> Privacy Policy</Text>
              </Text>

              <View style={{ alignItems: 'center', width: '100%' }}>
                <Pressable
                  style={[
                    styles.loginButton,
                    !isFormValid && styles.loginButtonDisabled
                  ]}
                  onPress={handleLogin}
                  disabled={!isFormValid}
                >
                  <Text style={[
                    styles.loginButtonText,
                    !isFormValid && styles.loginButtonTextDisabled
                  ]}>Login</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>

      {/* ========================= TERMS MODAL ========================= */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showTerms}
        onRequestClose={closeModals}
      >
        <BlurView intensity={60} tint="dark" style={styles.overlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Terms and conditions of IssueFlow</Text>
              <Pressable onPress={closeModals}>
                <Ionicons name="close-outline" size={26} color="#000" />
              </Pressable>
            </View>
            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.modalText}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Cras ipsum ligula, iaculis quis commodo et, ornare fermentum odio. 
                Ut libero dolor, suscipit a diam nec, faucibus viverra eros. 
                Proin convallis euismod ligula, sed ultrices lacus rutrum a.
                Donec volutpat maximus leo, vitae rutrum leo dapibus eu.
                Curabitur consectetur erat nisi, eu sollicitudin tellus fermentum pharetra.
                Maecenas sed tristique eros. Sed massa est, ullamcorper nec augue posuere, 
                tempor finibus orci. Praesent eleifend nisi at risus dignissim, in blandit eros pharetra.
                Vestibulum gravida in neque vel porta. Integer nibh dolor, tristique eget auctor at,
                porta nec diam. Nam enim orci, aliquam nec vehicula ac, tincidunt vitae justo.
              </Text>
            </ScrollView>
          </View>
        </BlurView>
      </Modal>

      {/* ========================= PRIVACY MODAL ========================= */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showPrivacy}
        onRequestClose={closeModals}
        >
        <BlurView intensity={60} tint="dark" style={styles.overlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Privacy policy of IssueFlow</Text>
              <Pressable onPress={closeModals}>
                <Ionicons name="close-outline" size={26} color="#000" />
              </Pressable>
            </View>
            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
              >
              <Text style={styles.modalText}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Cras ipsum ligula, iaculis quis commodo et, ornare fermentum odio.
                Suspendisse volutpat, eros vel aliquet bibendum, sem velit faucibus lorem,
                eget pretium elit elit vel magna. Integer tincidunt bibendum erat.
                Nullam non lorem at massa fermentum sagittis.
              </Text>
            </ScrollView>
          </View>
      </BlurView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    width: '100%',
    padding: 10,
    backgroundColor: '#ffffffff',
  },
  total: {
    flexGrow: 1,
    height: '100%',
    backgroundColor: '#ffffffff',
  },
  logo: {
    width: '90%',
    height: '10%',
    alignItems: 'center',
    padding: 10,
    marginTop: '26%',
    marginBottom: '26%',
  },
  main: {
    width: '95%',
    height: '25%',
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  forgot: {
    width: '98%',
    marginTop: '1%',
    textAlign: 'right',
  },
  subtitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#081A41',
    fontWeight: '500',
    textAlign: 'left',
    marginBottom: '4%',
  },
  userContainer: {
    width: '100%',
    height: '28%',
    borderWidth: 1,
    borderColor: '#CED6E0',
    borderRadius: 14,
    flexDirection: 'row',
    marginBottom: '3%',
    alignItems: 'center',
  },
  input: {
    fontFamily: 'Poppins-Regular',
    paddingHorizontal: 20,
    fontSize: 16,
    height: '100%',
    color: '#000',
    flex: 1,
  },
  passwordContainer: {
    width: '100%',
    height: '28%',
    borderWidth: 1,
    borderColor: '#CED6E0',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    fontFamily: 'Poppins-Regular',
    flex: 1,
    height: '100%',
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#000',
  },
  eyeIcon: {
    padding: 15,
  },
  forgotPassword: {
    textAlign: 'right',
    fontFamily: 'Poppins-Regular',
    color: '#A0A0A0',
  },
  loginButton: {
    width: '100%',
    height: '72%',
    marginTop: '4%',
    flexDirection: 'row',
    backgroundColor: '#0D2B6C',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  loginButtonDisabled: {
    backgroundColor: '#6C849D1F',
  },
  loginButtonTextDisabled: {
    color: '#A0A0A0',
  },
  loginButtonText: {
    fontFamily: 'Poppins-Regular',
    color: '#FAFBFC',
    fontSize: 18,
    fontWeight: '500',
  },
  footerText: {
    fontSize: 13,
    color: '#A0A0A0',
    textAlign: 'left',
    fontFamily: 'Poppins-Regular',
  },
  linkText: {
    fontFamily: 'Poppins-Regular',
    color: '#4D8CFF',
    fontSize: 13,
  },
  bottom: {
    flex: 1,
    width: '95%',
    height: '25%',
    marginTop: '58%',
    alignItems: 'center',
  },

  // ===== MODAL STYLES =====
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
    maxHeight: '75%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontFamily: 'Poppins-Regular',
    fontWeight: '800',
    fontSize: 16,
    color: '#081A41',
  },
  modalBody: {
    maxHeight: 400,
  },
  modalText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#4B4B4B',
    lineHeight: 20,
  },
});

export default LoginScreen;
