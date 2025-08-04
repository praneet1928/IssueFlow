import React, { useState,useEffect } from 'react';
import { RootStackParamList } from '../../types/navigation';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  StyleSheet,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StatusBar,
  View,
  Linking,
  Pressable,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableWithoutFeedback
} from 'react-native';

import { Ionicons } from '@expo/vector-icons'; 
import Issueflow from "../../../assets/images/issueflow.svg";

type NavigationProp = {
    navigate: (screen: keyof RootStackParamList) => void;
  };


const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  
  const isFormValid = email.length > 0 && password.length > 0;

  const handleLogin = () => {
    if (isFormValid) {
      console.log('Logging in with:', { email, password });}
    navigation.navigate('App');
  };

  const handleforgot = () => {
    navigation.navigate('Forgot');
  };

  const handleTerms = () => {
      Linking.openURL('https://issuerflow.com/terms');
    };
  
    const handlePrivacy = () => {
      Linking.openURL('https://issuerflow.com/privacy');
    };

    const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (


<KeyboardAwareScrollView
  contentContainerStyle={{ flexGrow: 1 }}
  enableOnAndroid={true}
  extraScrollHeight={360}
  style={styles.container}
  keyboardShouldPersistTaps="handled"
  showsVerticalScrollIndicator={false} 
  >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style= {{alignItems: 'center'}}>
    <View style={styles.logo}>
      <Issueflow width={'90%'} height={'90%'} />
    </View>
     {/*top*/}
    <View style={styles.main}>
       <Text style={[styles.subtitle]}>Login to your account</Text>
       {/*mid*/}
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
            name={passwordVisible ? 'eye-outline': 'eye-off-outline'}
            size={19}
            color='#CED6E0'
          />
        </TouchableOpacity>
        </View>

        <Pressable style={styles.forgot} onPress={handleforgot}>
          <Text style={styles.forgotPassword} >Forgot Password?</Text>
        </Pressable>
        </View>

        
  
        <View style={styles.bottom}>
            <Text style={styles.footerText}>
              By signing up via your social profile or by email you agree with IssueFlow's
            <Text style={styles.linkText} onPress={handleTerms}> Terms & Conditions</Text> and
            <Text style={styles.linkText} onPress={handlePrivacy}> Privacy Policy</Text>
            </Text>
            <View style={{alignItems: 'center', width: '100%'}}>
              <Pressable style={[
                 styles.loginButton, !isFormValid && styles.loginButtonDisabled
                 ]} 
                onPress={handleLogin} disabled={!isFormValid} >
            <Text style={[styles.loginButtonText,!isFormValid && styles.loginButtonTextDisabled]}>Login</Text>
          </Pressable>
          </View>
          
          </View>
          
</View>
</TouchableWithoutFeedback>
</KeyboardAwareScrollView>  



  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    height: '100%',
    width: '100%',
    paddingTop: StatusBar.currentHeight,
   // alignItems: 'center',
   //justifyContent: 'center',
    padding: 10,
    backgroundColor: '#fff',
    //position: 'absolute',
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    //width: '100%',
   // height: '100%',
   alignItems: 'center',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#fff',
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
   // marginBottom: '45%',
    backgroundColor: '#fff',
    flexGrow: 1,
  },

  forgot: {
    width:'98%',
   // height: '50%',
    fontFamily: 'Poppins-Regular',
  //  alignItems: 'center',
    marginTop: '1%',
    textAlign: 'right',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2e00c7',
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
    color: '#A0A0A0',
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
    flex:1,
  },
  passwordContainer: {
    width: '100%',
    height: '28%',
    borderWidth: 1,
    color: '#A0A0A0',
    borderColor: '#CED6E0',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
   // marginBottom: 0,
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
   // marginTop: '25%',
    color: '#A0A0A0',
  },
  loginButton: {
    width: '100%',
    height: '70%',
    marginTop: '4%',
    flexDirection: 'row',
    backgroundColor: '#0D2B6C',
    justifyContent: 'center',
    alignItems: 'center',
   // paddingHorizontal: '18%',
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
   // marginTop: '30%',
   //position: 'absolute',
   alignItems: 'center',
    textAlign: 'left',
    fontFamily: 'Poppins-Regular',
  },
  linkText: {
    fontFamily: 'Poppins-Regular',
    color: '#4D8CFF',
    fontSize: 13,
   // alignContent: 'center',
  },
  bottom: {
    flex: 1,
    width: '95%',
    height: '25%',
    marginTop: '60%',
    alignItems: 'center'
  },
});

export default LoginScreen;
