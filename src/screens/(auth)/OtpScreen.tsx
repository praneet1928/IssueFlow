import * as React from "react";
import {Text, StyleSheet, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView,Keyboard} from "react-native";
import { RootStackParamList } from '../../types/navigation';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";
import Component from "../../../assets/images/back.svg"
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Unactive'>;

const Unactive = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'Unactive'>>();
  const emailFromParams = (route.params as any)?.email as string | undefined;
  
  const maskEmail = (email?: string) => {
    if (!email || !email.includes('@')) return '********';
    const [local, domain] = email.split('@');
    let localMasked = '';
    if (local.length === 0) {
      localMasked = '';
    } else if (local.length === 1) {
      localMasked = local[0];
    } else if (local.length === 2) {
      localMasked = `${local[0]}${local[1]}`.replace(/.(?=.$)/, '*');
    } else {
      localMasked = `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}`;
    }
    const lastDot = domain.lastIndexOf('.');
    if (lastDot === -1) {
      return `${localMasked}@${'*'.repeat(domain.length)}`;
    }
    const domainName = domain.slice(0, lastDot);
    const tld = domain.slice(lastDot + 1);
    const domainMasked = `${'*'.repeat(domainName.length)}.${tld}`;
    return `${localMasked}@${domainMasked}`;
  };
  
  React.useEffect(() => {
    const focusId = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 120);
    return () => {
      clearTimeout(focusId);
    };
  }, []);
  
  // OTP State Management
  const [otp, setOtp] = React.useState(['', '', '', '']);
  const [timer, setTimer] = React.useState(119); 
  const [isResendDisabled, setIsResendDisabled] = React.useState(true);
  const [isSubmitDisabled, setIsSubmitDisabled] = React.useState(true);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(0);
  const [isError, setIsError] = React.useState(false);
  
  // Refs for input fields
  const inputRefs = React.useRef<Array<TextInput | null>>([]);
  
  // Timer countdown effect
  React.useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setIsResendDisabled(false);
    }
  }, [timer]);
  
  // Check if OTP is complete
  React.useEffect(() => {
    const isComplete = otp.every(digit => digit !== '');
    setIsSubmitDisabled(!isComplete);
  }, [otp]);
  
  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle OTP input change
  const handleOtpChange = (value: string, index: number) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;
    
    // Reset error state when user starts typing
    if (isError) {
      setIsError(false);
    }
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    }
  };
  
  // Handle backspace
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setActiveIndex(index - 1);
    }
  };
  
  // Handle focus
  const handleFocus = (index: number) => {
    setActiveIndex(index);
    if (isError) {
      setIsError(false);
    }
  };
  
  // Handle blur
  const handleBlur = () => {
    setActiveIndex(null);
  };
  
  // Handle resend code
  const handleResendCode = () => {
    if (isResendDisabled) return;
    setTimer(119);
    setIsResendDisabled(true);
    setOtp(['', '', '', '']);
    setIsError(false);
    inputRefs.current[0]?.focus();
    setActiveIndex(0);
    
    // TODO: Call your resend OTP API here
    // Alert.alert('Success', 'OTP has been resent to your email');
  };
  
  // Handle submit
  const handleSubmit = async() => {
    const otpValue = otp.join('');
    
    // TODO: Call your verify OTP API here with otpValue
    console.log('OTP Submitted:', otpValue);
    
    // Example validation (replace with actual API call)
    if (otpValue === '1234') { // Mock validation
      // Navigate to next screen on success
      Keyboard.dismiss();               
      await new Promise(r => setTimeout(r, 120)); 
      navigation.navigate('NewPassword');
    } else {
      // Show error state with red borders
      setIsError(true);
      // Don't clear OTP, just show error state
    }
  };
  
  // Get border style for each input box
  const getBorderStyle = (index: number) => {
    if (isError) {
      return styles.wrapperError;
    }
    if (activeIndex === index) {
      return styles.wrapperActive;
    }
    return {};
  };

  return (
    <SafeAreaView style={[styles.forgotPasswordotpunactive, styles.viewFlexBox]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
      <View style={[styles.view, styles.viewFlexBox]}>
        <View style={[styles.topAppBar, styles.barPosition]}>
          <Component onPress={() => navigation.goBack()} style={styles.backIcon} width={20} height={20} />
        </View>
        
        <Text style={styles.enterOtp}>Enter OTP</Text>
        
        <Text style={styles.weHaveSentContainer}>
          <Text style={styles.forgotPasswordotpunactiveWeHaveSentContainer}>
            <Text style={styles.weHaveSent}>We have sent the verification code to your email address</Text>
            <Text style={styles.jncom}> {maskEmail(emailFromParams)}</Text>
          </Text>
        </Text>
        
        <View style={styles.frameParent}>
          {[0, 1, 2, 3].map((index) => (
            <View key={index} style={[styles.wrapper, { left: index * 94 }, getBorderStyle(index)]}>
              <TextInput
                ref={(ref) => { inputRefs.current[index] = ref; }}
                style={[styles.text, otp[index] && styles.textFilled, isError && styles.textError]}
                value={otp[index]}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                onFocus={() => handleFocus(index)}
                onBlur={handleBlur}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                autoFocus={index === 0}
                textAlign="center"
              />
            </View>
          ))}
        </View>
        
        <Text style={[styles.theCodeWillContainer, styles.containerPosition]}>
          <Text style={styles.theCodeWill}>{`The code will expire in `}</Text>
          <Text style={styles.text4Typo}>{formatTime(timer)}</Text>
        </Text>
        
        {isError ? (
          <View style={styles.errorMessageWrapper}>
            <Text style={styles.errorIcon}>ⓘ</Text>
            <Text style={styles.errorMessage}>Invalid OTP, please try again</Text>
          </View>
        ) : (
          <View style={[styles.enterThe4DigitOtpWrapper, styles.topAppBarFlexBox]}>
            <Text style={styles.enterThe4Digit}>Enter the 4-digit OTP</Text>
          </View>
        )}
        
        <View style={styles.bottomActions}>
          <View style={styles.ifYouDidntWrapper}>
            <Text style={styles.ifYouDidntText}>
              <Text style={styles.ifYouDidnt}>If you didn't receive a code? </Text>
              <Text onPress={handleResendCode} style={[styles.resendCode, isResendDisabled && styles.resendCodeDisabled]}>
                Resend code
              </Text>
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.labelTextWrapper, !isSubmitDisabled && styles.labelTextWrapperActive]}
            onPress={handleSubmit}
            disabled={isSubmitDisabled}
            activeOpacity={0.7}
          >
            <Text style={[styles.labelText, !isSubmitDisabled && styles.labelTextActive]}>
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  forgotPasswordotpunactive: {
    backgroundColor: "#fff"
  },
  viewFlexBox: {
    flex: 1,
    backgroundColor: "#fff"
  },
  wrapper: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    width: 78,
    borderWidth: 1,
    borderColor: "#ced6e0",
    borderStyle: "solid",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 12,
    top: 0,
    height: 52,
    position: "absolute",
    overflow: "hidden"
  },
  wrapperActive: {
    borderColor: "#1A56D9",
    borderWidth: 2,
  },
  wrapperError: {
    borderColor: "#D92D20",
    borderWidth: 1,
  },
  textTypo: {
    fontFamily: "Poppins-Medium",
    fontWeight: "500"
  },
  barPosition: {
    width: 390,
    left: 0,
    position: "absolute"
  },
  containerPosition: {
    left: "50%",
    textAlign: "left",
    fontSize: 14,
    position: "absolute"
  },
  topAppBarFlexBox: {
    flexDirection: "row",
    alignItems: "center"
  },
  view: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff"
  },
  enterOtp: {
    top: 108,
    fontSize: 24,
    color: "#081a41",
    textAlign: "center",
    fontFamily: "Poppins-Medium",
    fontWeight: "500",
    left: 15,
    position: "absolute"
  },
  weHaveSentContainer: {
    top: 148,
    display: "flex",
    width: 360,
    alignItems: "center",
    textAlign: "left",
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    left: 15,
    position: "absolute"
  },
  forgotPasswordotpunactiveWeHaveSentContainer: {
    width: "100%"
  },
  weHaveSent: {
    color: "#4b4b4b"
  },
  jncom: {
    color: "#1a56d9"
  },
  frameParent: {
    marginLeft: -180,
    top: 210,
    height: 52,
    left: "50%",
    width: 360,
    position: "absolute"
  },
  text: {
    fontSize: 18,
    color: "#081a41",
    textAlign: 'center',
    fontFamily: "Poppins-Medium",
    fontWeight: "500",
    width: '100%',
    height: '100%',
    includeFontPadding: false,
    textAlignVertical: 'center',
    padding: 0,
  },
  textFilled: {
    color: "#081a41",
  },
  textError: {
    color: "#D92D20",
  },
  errorMessageWrapper: {
    top: 265,
    left: 15,
    flexDirection: "row",
    alignItems: "center",
    position: "absolute"
  },
  errorIcon: {
    fontSize: 14,
    color: "#D92D20",
    marginLeft: 3,
    fontWeight: 800,
    marginRight: 3,
  },
  errorMessage: {
    fontSize: 12,
    color: "#D92D20",
    fontStyle: "italic",
    letterSpacing: 0.25,
    fontFamily: "Poppins-Regular",
  },
  topAppBar: {
    top: 10,
    height: 64,
    paddingLeft: 8,
    paddingTop: 8,
    paddingRight: 20,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  backIcon: {
    width: 40,
    height: 40,
    marginLeft: 10,
  },
  theCodeWillContainer: {
    marginLeft: -98,
    top: 298,
    color: "#4b4b4b"
  },
  theCodeWill: {
    fontFamily: "Poppins-Regular"
  },
  text4Typo: {
    fontFamily: "Poppins-Regular",
    fontWeight: "800",
  },
  enterThe4DigitOtpWrapper: {
    top: 266,
    left: 15,
    position: "absolute",
    flexDirection: "row"
  },
  enterThe4Digit: {
    fontSize: 11,
    lineHeight: 16,
    fontStyle: "italic",
    marginLeft: 5,
    fontFamily: "Poppins-Italic",
    color: "#4b4b4b",
    textAlign: "left"
  },
  ifYouDidntWrapper: {
    justifyContent: 'center',
    flexDirection: "row",
    alignItems: "center",
    alignSelf: 'center',
    marginTop: 24
  },
  ifYouDidntText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    flexDirection: "row",
    alignItems: "center"
  },
  ifYouDidnt: {
    color: "#a0a0a0",
    fontFamily: "Poppins-Regular"
  },
  resendCode: {
    fontFamily: "Poppins-Medium",
    fontWeight: "500",
    color: "#1a56d9",
    justifyContent: 'center',
    fontSize: 14
  },
  resendCodeDisabled: {
    color: "#a0a0a0"
  },
  labelTextWrapper: {
    backgroundColor: "#edf0f3",
    paddingHorizontal: 155,
    paddingVertical: 15,
    justifyContent: "center",
    borderRadius: 12,
    flexDirection: "row",
    height: 52,
    width: 360,
    alignItems: "center",
    alignSelf: 'center',
    marginTop: 16,
    overflow: "hidden"
  },
  labelTextWrapperActive: {
    backgroundColor: "#0D2B6C"
  },
  labelText: {
    color: "#a0a0a0",
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Poppins-Medium",
    fontWeight: "500"
  },
  labelTextActive: {
    color: "#fff"
  },
  bottomActions: {
    marginTop: 'auto',
    paddingBottom: 24
  }
});

export default Unactive;