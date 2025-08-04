import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
//import Icon from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Image } from 'react-native-svg';
import Issuflow from "../../../assets/images/issueflow.svg";

const { width } = Dimensions.get('window');

const LoginScreen: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={Platform.OS === 'ios' ? 20 : -80}
    >
      <View style={styles.main}>
        <View style= {styles.logo}>
        <Issuflow width={'80%'} height={'70%'}/>
        </View>
        <Text style={styles.subtitle}>Login to your account</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Employee ID or email address"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="password"
          placeholderTextColor="#999"
          secureTextEntry={!passwordVisible}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setPasswordVisible(!passwordVisible)}
        >
          
        </TouchableOpacity>
      </View>

      <Text style={styles.termsText}>
        By signing up via your social profile or by email you agree with IssueFlow’s{' '}
        <Text style={styles.link}>Terms & Conditions</Text> and{' '}
        <Text style={styles.link}>Privacy Policy</Text>
      </Text>

      <TouchableOpacity
        style={[
          styles.loginButton,
          { backgroundColor: isFormValid ? '#0A2D7D' : '#e8ebef' },
        ]}
        disabled={!isFormValid}
      >
        <Text style={[ styles.loginButtonText, { color: isFormValid ? '#fff' : '#999' },]}>
          Login
        </Text>
      </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    width: "100%",
    //justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 60,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'left',
  },
  logo: {
    width: '100%',
    height: '10%',
    alignItems: 'center',
    padding: 10,
    marginTop: '26%',
    marginBottom: '26%',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '500',
    color: '#000',
    marginBottom: 16,
  
  },
  inputContainer: {
    width: width * 0.9,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 12,
    backgroundColor: '#fafafa',
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#000',
  },
  icon: {
    padding: 4,
  },
   main: {
    width: '100%',
    height: '65%',
   // marginBottom: '45%',
    backgroundColor: '#fff',
    flex: 1,
  },
  termsText: {
    width: width * 0.85,
    textAlign: 'left',
    fontSize: 12,
    paddingHorizontal: 8,
    color: '#888',
    marginTop: "60%",
    marginVertical: 30,
  },
  link: {
    color: '#337ab7',
    textDecorationLine: 'underline',
  },
  loginButton: {
    width: width * 0.85,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;
