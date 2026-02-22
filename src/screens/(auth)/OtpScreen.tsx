import * as React from "react";
import {Text, StyleSheet, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView,Keyboard} from "react-native";
import { RootStackParamList } from '../../types/navigation';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
type NavigationProp = StackNavigationProp<RootStackParamList, 'OtpScreen'>;

const Unactive = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'OtpScreen'>>();
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
  if (e.nativeEvent.key === "Backspace") {

    const newOtp = [...otp];

    if (newOtp[index] !== "") {
      // Clear current box
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    if (index > 0) {
      // Move to previous and clear it
      inputRefs.current[index - 1]?.focus();
      newOtp[index - 1] = "";
      setOtp(newOtp);
      setActiveIndex(index - 1);
    }
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
const insets = useSafeAreaInsets();

  // Get border style for each input box
  const getBorderStyle = (index: number) => {
    if (isError) {
      return styles.otpBoxError;
    }
    if (activeIndex === index) {
      return styles.otpBoxActive;
    }
    return {};
  };

  return (
  <SafeAreaView style={styles.safeArea}>
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.container]}>

          {/* HEADER */}
          
            <Ionicons
            name="chevron-back"
            size={24}
            style={{left: -5}}
            onPress={() => navigation.goBack()}
            color="#0F172A"
          />
      

          {/* TITLE */}
          <Text style={styles.title}>Enter OTP</Text>

          {/* SUBTEXT */}
          <Text style={styles.subtitle}>
            We have sent the verification code to your email address{" "}
            <Text style={styles.email}>{maskEmail(emailFromParams)}</Text>
          </Text>

          {/* OTP BOXES */}
          <View style={styles.otpRow}>
            {[0, 1, 2, 3].map((index) => (
              <View
                key={index}
                style={[
  styles.otpBox,
  activeIndex === index && !isError && styles.otpBoxActive,
  isError && styles.otpBoxError ,
]}

              >
                <TextInput
  ref={(ref) => {
    inputRefs.current[index] = ref;
  }}
  style={[
    styles.otpInput,
    isError && styles.otpInputError,
  ]}
  value={otp[index]}
  onChangeText={(value) => handleOtpChange(value, index)}
  onKeyPress={(e) => handleKeyPress(e, index)}
  onFocus={() => handleFocus(index)}
  onBlur={handleBlur}
  keyboardType="number-pad"
  placeholder="-"
  placeholderTextColor={"#CED6E0"}
  maxLength={1}
  textAlign="center"
/>

              </View>
            ))}
          </View>
          
          {isError ? (
  <View style={styles.errorRow}>
    <Text style={styles.errorIcon}>ⓘ</Text>
    <Text style={styles.errorText}>
      Invalid OTP, please try again
    </Text>
  </View>
) : (
  <Text style={styles.helperText}>
    Enter the 4-digit OTP
  </Text>
)}


          <Text style={styles.timerText}>
            The code will expire in{" "}
            <Text style={styles.timerBold}>
              {formatTime(timer)}
            </Text>
          </Text>

          {/* PUSH BOTTOM DOWN */}
          <View style={{ flex: 1 }} />

          {/* BOTTOM SECTION */}
          <View style={styles.bottomSection}>
            <Text style={styles.resendWrapper}>
              If you didn't receive a code?{" "}
              <Text
                style={[
                  styles.resend,
                  isResendDisabled &&
                    styles.resendDisabled,
                ]}
                onPress={handleResendCode}
              >
                Resend code
              </Text>
            </Text>

            <TouchableOpacity
              style={[
                styles.submitButton,
                !isSubmitDisabled &&
                  styles.submitButtonActive,
              ]}
              onPress={handleSubmit}
              disabled={isSubmitDisabled}
            >
              <Text
                style={[
                  styles.submitText,
                  !isSubmitDisabled &&
                    styles.submitTextActive,
                ]}
              >
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
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "600",
    fontFamily: "Poppins-Regular",
    color: "#081A41",
    marginTop: 30,
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 14,
    color: "#4B4B4B",
    fontFamily: "Poppins-Regular",
  },

  email: {
    color: "#1A56D9",
  },

  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  otpBox: {
    width: 78,
    height: 52,
    borderWidth: 1,
    borderColor: "#CED6E0",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  otpBoxActive: {
    borderColor: "#1A56D9",
    borderWidth: 1,
  },

  otpBoxError: {
    borderColor: "#D92D20",
  },

  otpInput: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4B4B4B",
    fontFamily: "Poppins-Regular"
  },

  timerText: {
    marginTop: 16,
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
    fontFamily: "Poppins-Regular",
    color: "#4B4B4B",
  },

  timerBold: {
    fontWeight: "700",
    color: "#4B4B4B",
  },

  bottomSection: {
    paddingBottom: 24,
  },

  resendWrapper: {
    textAlign: "center",
    marginBottom: 12,
    fontSize: 14,
    color: "#A0A0A0",
  },

  resend: {
    color: "#1A56D9",
    fontWeight: "500",
  },

  resendDisabled: {
    color: "#A0A0A0",
  },

  submitButton: {
    height: 52,
    backgroundColor: "#EDF0F3",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  submitButtonActive: {
    backgroundColor: "#0D2B6C",
  },
otpInputError: {
  color: "#D92D20",
  fontFamily: "Poppins-Regular"
},

  submitText: {
    color: "#A0A0A0",
    fontFamily: "Poppins-Regular",
    fontWeight: "600",
    fontSize: 14,
  },

  submitTextActive: {
    color: "#fff",
  },
  helperText: {
  fontSize: 12,
  fontStyle: "italic",
  fontFamily: "Poppins-Regular",
  color: "#4B4B4B",
  marginTop: 8,
},

errorRow: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 8,
},

errorIcon: {
  fontSize: 14,
  color: "#D92D20",
  marginRight: 2,
},

errorText: {
  fontSize: 12,
  color: "#D92D20",
  fontStyle: "italic",
  fontFamily: "Poppins-Regular",
},

});


export default Unactive;