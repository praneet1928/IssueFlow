import * as React from "react";
import {Text, StyleSheet, View, Image, TextInput} from "react-native";
import { RootStackParamList } from '../../types/navigation';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";
import Component from "../../../assets/images/back.svg"
import Component1 from "../../../assets/images/back.svg"
import Component2 from "../../../assets/images/back.svg"
import type { StackNavigationProp } from '@react-navigation/stack';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Unactive'>;


const Unactive = () => {
  	const navigation = useNavigation<NavigationProp>();
  	return (
    		<SafeAreaView style={[styles.forgotPasswordotpunactive, styles.viewFlexBox]}>
      			<View style={[styles.view, styles.viewFlexBox]}>
        				<View style={[styles.topAppBar, styles.barPosition]}>
          					<Component onPress={()=> navigation.goBack()}style={styles.backIcon} width={20} height={20} />
        				</View>
        				<Text style={styles.enterOtp}>Enter OTP</Text>
        				<Text style={styles.weHaveSentContainer}>
          					<Text style={styles.forgotPasswordotpunactiveWeHaveSentContainer}>
            						<Text style={styles.weHaveSent}>We have sent the verification code to your email address</Text>
            						<Text style={styles.jncom}> j**n@*****.com</Text>
          					</Text>
        				</Text>
        				<View style={styles.frameParent}>
          					<View style={[styles.wrapper, styles.frameLayout1]}>
            						<TextInput style={[styles.text, styles.textTypo]} placeholder="-" placeholderTextColor='#000000ff'></TextInput>
          					</View>
          					<View style={[styles.container, styles.frameLayout1]}>
            						<TextInput style={[styles.text, styles.textTypo]}></TextInput>
          					</View>
          					<View style={[styles.frame, styles.frameLayout1]}>
            						<TextInput style={[styles.text, styles.textTypo]}></TextInput>
          					</View>
          					<View style={[styles.frameView, styles.frameLayout1]}>
            						<TextInput style={[styles.text, styles.textTypo]}></TextInput>
          					</View>
        				</View>
        				<Text style={[styles.theCodeWillContainer, styles.containerPosition]}>
          					<Text style={styles.theCodeWill}>{`The code will expire in `}</Text>
          					<Text style={styles.text4Typo}>04:58</Text>
        				</Text>
        				<View style={[styles.enterThe4DigitOtpWrapper, styles.topAppBarFlexBox]}>
          					<Text style={styles.enterThe4Digit}>Enter the 4-digit OTP</Text>
        				</View>
        				<Text style={[styles.ifYouDidntContainer, styles.containerPosition]}>
          					<Text style={styles.theCodeWill}>
            						<Text style={styles.ifYouDidnt}>If you didn't receive a code?</Text>
              							<Text style={styles.jncom}>{` `}</Text>
            						</Text>
            						<Text style={styles.jncom}>
              							<Text style={styles.textTypo}>Resend code</Text>
            						</Text>
          					</Text>
          					<View style={styles.labelTextWrapper}>
            						<Text style={styles.labelText}>Submit</Text>
          					</View>
          					
          					
          					</View>
          					</SafeAreaView>);
          					};
          					
          					const styles = StyleSheet.create({
            						forgotPasswordotpunactive: {
              							backgroundColor: "#fff"
            						},
            						viewFlexBox: {
              							flex: 1,
              							backgroundColor: "#fff"
            						},
            						frameLayout1: {
              							paddingVertical: 16,
              							paddingHorizontal: 12,
              							width: 78,
              							borderWidth: 1,
              							borderColor: "#ced6e0",
              							borderStyle: "solid",
              							justifyContent: "center",
              							flexDirection: "row",
              							borderRadius: 12,
              							top: 0,
              							height: 52,
              							alignItems: "center",
              							position: "absolute",
              							overflow: "hidden"
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
            						image3Layout: {
              							height: 336,
              							width: 390,
              							left: 0,
              							position: "absolute"
            						},
            						frameLayout: {
              							height: 15,
              							width: 11,
              							backgroundColor: "#d0d3dc",
              							position: "absolute"
            						},
            						timePosition: {
              							top: "50%",
              							position: "absolute"
            						},
            						view: {
              							height: 844,
              							overflow: "hidden",
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
            						wrapper: {
              							left: 0
            						},
            						text: {
              							fontSize: 20,
              							color: "#ced6e0",
                            justifyContent: 'center',
              							alignItems: 'center',
            						},
            						container: {
              							left: 94
            						},
            						frame: {
              							left: 188
            						},
            						frameView: {
              							left: 282
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
              							fontFamily: "Poppins-SemiBold",
              							fontWeight: "600"
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
            						ifYouDidntContainer: {
              							//marginLeft: -143,
                            
              							top: 407,
              							letterSpacing: -0.1,
              							overflow: "hidden"
            						},
            						ifYouDidnt: {
              							color: "#a0a0a0"
            						},
            						labelTextWrapper: {
              							top: 440,
              							backgroundColor: "#edf0f3",
              							paddingHorizontal: 155,
              							paddingVertical: 15,
              							justifyContent: "center",
              							borderRadius: 12,
              							flexDirection: "row",
              							height: 52,
              							width: 360,
              							alignItems: "center",
              							left: 15,
              							position: "absolute",
              							overflow: "hidden"
            						},
            						labelText: {
              							color: "#a0a0a0",
              							fontSize: 14,
              							textAlign: "center",
              							fontFamily: "Poppins-Medium",
              							fontWeight: "500"
            						},
            						image3Parent: {
              							top: 508
            						},
            						image3Icon: {
              							top: 0
            						},
            						frameChild: {
              							top: 26,
              							left: 213
            						},
            						frameItem: {
              							top: 27,
              							left: 164
            						},
            						statusBar: {
              							backgroundColor: "rgba(255, 255, 255, 0.5)",
              							height: 44,
              							top: 0
            						},
            						symbols: {
              							marginTop: -5,
              							right: 16,
              							width: 68,
              							height: 13,
              							overflow: "hidden"
            						},
            						batteryIcon: {
              							marginTop: -5.94,
              							right: 1,
              							width: 25,
              							height: 12
            						},
            						combinedShapeIcon: {
              							width: 17,
              							height: 11
            						},
            						wiFiIcon: {
              							width: 15,
              							height: 11
            						},
            						time: {
              							marginTop: -10,
              							width: 180,
              							height: 22,
              							left: 0
            						},
            						forgotPasswordotpunactiveTime: {
              							marginTop: -9,
              							left: 28,
              							fontSize: 15,
              							letterSpacing: -0.17,
              							color: "#000",
              							width: 39,
              							fontFamily: "Poppins-SemiBold",
              							fontWeight: "600",
              							textAlign: "left"
            						}
          					});
          					
          					export default Unactive;
          					