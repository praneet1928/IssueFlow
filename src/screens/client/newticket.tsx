import * as React from "react";
import {Text, StyleSheet, View, Pressable, Image} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Component1 from "../../../assets/images/cross.svg"
import Component3 from "../../../assets/images/cross.svg"

const IssueForm = () => {
  	
  	return (
    		<SafeAreaView style={styles.viewBg}>
      			<View style={[styles.view, styles.viewBg]}>
        				<View style={[styles.enterTitleWrapper, styles.enterWrapperPosition]}>
          					<Text style={[styles.enterTitle, styles.enterTypo]}>Enter title</Text>
        				</View>
        				<View style={[styles.enterLocationWrapper, styles.enterWrapperPosition]}>
          					<Text style={[styles.enterLocation, styles.enterTypo]}>Enter location</Text>
        				</View>
        				<View style={[styles.descriptionOptionalWrapper, styles.enterWrapperPosition]}>
          					<Text style={[styles.enterTitle, styles.enterTypo]}>Description (optional)</Text>
        				</View>
        				<Text style={styles.text} />
        				<Text style={[styles.issueType, styles.issueTypo]}>
          					<Text style={styles.issueflowclientissueFormIssueType}>ISSUE TYPE</Text>
          					<Text style={styles.issueflowclientissueFormText}>*</Text>
        				</Text>
        				<Text style={[styles.selectPriority, styles.addTypo]}>
          					<Text style={styles.issueflowclientissueFormIssueType}>Select priority</Text>
          					<Text style={styles.issueflowclientissueFormText}>*</Text>
        				</Text>
        				<Text style={[styles.title, styles.issueTypo]}>
          					<Text style={styles.issueflowclientissueFormIssueType}>TITLE</Text>
          					<Text style={styles.issueflowclientissueFormText}>*</Text>
        				</Text>
        				<Text style={[styles.location, styles.issueTypo]}>
          					<Text style={styles.issueflowclientissueFormIssueType}>LOCATION</Text>
          					<Text style={styles.issueflowclientissueFormText}>*</Text>
        				</Text>
        				<Text style={[styles.addProduct, styles.addTypo]}>
          					<Text style={styles.issueflowclientissueFormIssueType}>ADD Product</Text>
          					<Text style={styles.issueflowclientissueFormText}>*</Text>
        				</Text>
        				<Text style={[styles.addImage, styles.addTypo]}>ADD Image</Text>
        				<View style={[styles.component4, styles.componentFlexBox]}>
          					<Text style={[styles.network, styles.networkLayout]}>Network</Text>
        				</View>
        				<View style={[styles.component5, styles.componentFlexBox]}>
          					<Text style={[styles.network, styles.networkLayout]}>Hardware</Text>
        				</View>
        				<View style={[styles.component6, styles.componentFlexBox]}>
          					<Text style={[styles.network, styles.networkLayout]}>Other</Text>
        				</View>
        				<Pressable style={[styles.wrapper, styles.childLayout]} onPress={()=>{}}>
          					<Image style={styles.icon} resizeMode="cover" />
        				</Pressable>
        				<Component1 style={[styles.child, styles.childLayout]} width={52} height={52} />
        				<Pressable style={[styles.raiseIssueWrapper, styles.componentFlexBox]} onPress={()=>{}}>
          					<Text style={[styles.raiseIssue, styles.raiseIssueTypo]}>Raise issue</Text>
        				</Pressable>
        				<Pressable style={styles.container} onPress={()=>{}}>
          					<Image style={styles.issueflowclientissueFormIcon} resizeMode="cover" />
        				</Pressable>
        				<Text style={[styles.newIssue, styles.networkLayout]}>New Issue</Text>
        				<View style={[styles.component1, styles.componentBorder]}>
          					<Text style={[styles.network, styles.networkLayout]}>Critical</Text>
        				</View>
        				<View style={[styles.component2, styles.componentBorder]}>
          					<Text style={[styles.network, styles.networkLayout]}>Moderate</Text>
        				</View>
        				<View style={[styles.component3, styles.componentBorder]}>
          					<Text style={[styles.network, styles.networkLayout]}>Low</Text>
        				</View>
        				<View style={styles.statusBar}>
          					<View style={[styles.symbols, styles.timePosition]}>
            						<Image style={[styles.batteryIcon, styles.timePosition]} resizeMode="cover" />
            						<View style={styles.combinedShape}>
              							<View style={[styles.rectangle, styles.rectangleLayout]} />
              							<View style={[styles.issueflowclientissueFormRectangle, styles.rectangleLayout]} />
              							<View style={[styles.rectangle2, styles.rectangleLayout]} />
              							<View style={[styles.rectangle3, styles.rectangleLayout]} />
            						</View>
            						<Component3 style={styles.wiFiIcon} width={15} height={11} />
          					</View>
          					<View style={[styles.time, styles.timePosition]}>
            						<Text style={[styles.issueflowclientissueFormTime, styles.timePosition]}>10:10</Text>
          					</View>
        				</View>
      			</View>
    		</SafeAreaView>);
};

const styles = StyleSheet.create({
  	issueflowclientissueForm: {
    		flex: 1,
    		backgroundColor: "#fff"
  	},
  	viewBg: {
    		backgroundColor: "#fff",
    		flex: 1
  	},
  	enterWrapperPosition: {
    		paddingBottom: 16,
    		paddingRight: 12,
    		paddingTop: 16,
    		paddingLeft: 20,
    		alignItems: "center",
    		flexDirection: "row",
    		borderWidth: 1,
    		borderColor: "#ced6e0",
    		borderStyle: "solid",
    		borderRadius: 43,
    		height: 52,
    		width: 360,
    		left: 15,
    		position: "absolute",
    		overflow: "hidden"
  	},
  	enterTypo: {
    		display: "flex",
    		textAlign: "left",
    		color: "#a0a0a0",
    		fontFamily: "Poppins-Regular",
    		fontSize: 16,
    		alignItems: "center"
  	},
  	issueTypo: {
    		fontFamily: "Poppins-Medium",
    		fontWeight: "500",
    		left: 15,
    		position: "absolute"
  	},
  	addTypo: {
    		textTransform: "uppercase",
    		fontFamily: "Poppins-Medium",
    		fontWeight: "500",
    		fontSize: 12,
    		textAlign: "left",
    		left: 15,
    		position: "absolute"
  	},
  	componentFlexBox: {
    		paddingVertical: 0,
    		paddingHorizontal: 20,
    		justifyContent: "center",
    		alignItems: "center",
    		flexDirection: "row",
    		position: "absolute",
    		overflow: "hidden"
  	},
  	networkLayout: {
    		lineHeight: 52,
    		textAlign: "left"
  	},
  	childLayout: {
    		width: 52,
    		height: 52,
    		left: 15,
    		position: "absolute"
  	},
  	raiseIssueTypo: {
    		fontFamily: "Poppins-SemiBold",
    		fontWeight: "600",
    		textAlign: "left"
  	},
  	componentBorder: {
    		top: 238,
    		paddingVertical: 0,
    		paddingHorizontal: 20,
    		justifyContent: "center",
    		height: 40,
    		borderRadius: 20,
    		alignItems: "center",
    		flexDirection: "row",
    		borderWidth: 1,
    		borderColor: "#ced6e0",
    		borderStyle: "solid",
    		position: "absolute",
    		overflow: "hidden",
    		backgroundColor: "#fff"
  	},
  	timePosition: {
    		top: "50%",
    		position: "absolute"
  	},
  	rectangleLayout: {
    		borderRadius: 1,
    		bottom: "-9.35%",
    		width: "17.54%",
    		backgroundColor: "#000",
    		position: "absolute"
  	},
  	view: {
    		height: 1052,
    		overflow: "hidden",
    		width: "100%"
  	},
  	enterTitleWrapper: {
    		top: 442
  	},
  	enterTitle: {
    		width: 298
  	},
  	enterLocationWrapper: {
    		top: 844
  	},
  	enterLocation: {
    		width: 314
  	},
  	descriptionOptionalWrapper: {
    		top: 502
  	},
  	text: {
    		top: 144,
    		left: 26,
    		fontSize: 22,
    		lineHeight: 28,
    		fontFamily: "Roboto-Regular",
    		color: "#000",
    		textAlign: "left",
    		position: "absolute"
  	},
  	issueType: {
    		top: 310,
    		fontSize: 12,
    		fontWeight: "500",
    		textAlign: "left"
  	},
  	issueflowclientissueFormIssueType: {
    		color: "#4b4b4b"
  	},
  	issueflowclientissueFormText: {
    		color: "#f36500"
  	},
  	selectPriority: {
    		top: 208
  	},
  	title: {
    		top: 412,
    		fontSize: 12,
    		fontWeight: "500",
    		textAlign: "left"
  	},
  	location: {
    		top: 814,
    		fontSize: 12,
    		fontWeight: "500",
    		textAlign: "left"
  	},
  	addProduct: {
    		top: 586
  	},
  	addImage: {
    		top: 700,
    		color: "#4b4b4b"
  	},
  	component4: {
    		height: 40,
    		borderRadius: 20,
    		top: 340,
    		paddingVertical: 0,
    		paddingHorizontal: 20,
    		justifyContent: "center",
    		borderWidth: 1,
    		borderColor: "#ced6e0",
    		borderStyle: "solid",
    		backgroundColor: "#fff",
    		left: 15
  	},
  	network: {
    		color: "#a0a0a0",
    		fontSize: 16,
    		fontFamily: "Poppins-Regular",
    		lineHeight: 52
  	},
  	component5: {
    		left: 132,
    		height: 40,
    		borderRadius: 20,
    		top: 340,
    		paddingVertical: 0,
    		paddingHorizontal: 20,
    		justifyContent: "center",
    		borderWidth: 1,
    		borderColor: "#ced6e0",
    		borderStyle: "solid",
    		backgroundColor: "#fff"
  	},
  	component6: {
    		left: 263,
    		height: 40,
    		borderRadius: 20,
    		top: 340,
    		paddingVertical: 0,
    		paddingHorizontal: 20,
    		justifyContent: "center",
    		borderWidth: 1,
    		borderColor: "#ced6e0",
    		borderStyle: "solid",
    		backgroundColor: "#fff"
  	},
  	wrapper: {
    		top: 616
  	},
  	icon: {
    		//nodeWidth: 52,
    		//nodeHeight: 52,
    		height: "100%",
    		width: "100%"
  	},
  	child: {
    		top: 730
  	},
  	raiseIssueWrapper: {
    		top: 936,
    		borderRadius: 33,
    		backgroundColor: "rgba(108, 132, 157, 0.12)",
    		paddingVertical: 0,
    		paddingHorizontal: 20,
    		justifyContent: "center",
    		height: 52,
    		width: 360,
    		left: 15
  	},
  	raiseIssue: {
    		color: "#a0a0a0",
    		fontSize: 16,
    		fontFamily: "Poppins-SemiBold",
    		fontWeight: "600"
  	},
  	container: {
    		left: 330,
    		top: 64,
    		width: 40,
    		height: 40,
    		position: "absolute"
  	},
  	issueflowclientissueFormIcon: {
    		//nodeWidth: 40,
    		//nodeHeight: 40,
    		color: "#081a41",
    		height: "100%",
    		width: "100%"
  	},
  	newIssue: {
    		top: 124,
    		fontSize: 50,
    		color: "#081a41",
    		fontFamily: "Poppins-Medium",
    		fontWeight: "500",
    		left: 15,
    		position: "absolute"
  	},
  	component1: {
    		left: 15
  	},
  	component2: {
    		left: 124
  	},
  	component3: {
    		left: 254
  	},
  	statusBar: {
    		top: 0,
    		backgroundColor: "rgba(255, 255, 255, 0.5)",
    		width: 390,
    		height: 44,
    		left: 0,
    		position: "absolute"
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
  	combinedShape: {
    		width: 17,
    		height: 11,
    		backgroundColor: "#000"
  	},
  	rectangle: {
    		height: "37.38%",
    		top: "71.96%",
    		right: "82.46%",
    		left: "0%"
  	},
  	issueflowclientissueFormRectangle: {
    		height: "56.07%",
    		top: "53.27%",
    		right: "54.39%",
    		left: "28.07%"
  	},
  	rectangle2: {
    		height: "77.57%",
    		top: "31.78%",
    		right: "27.49%",
    		left: "54.97%"
  	},
  	rectangle3: {
    		top: "9.35%",
    		right: "0%",
    		left: "82.46%",
    		height: "100%"
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
  	issueflowclientissueFormTime: {
    		marginTop: -9,
    		left: 28,
    		fontSize: 15,
    		letterSpacing: -0.17,
    		width: 39,
    		fontFamily: "Poppins-SemiBold",
    		fontWeight: "600",
    		textAlign: "left",
    		color: "#000"
  	}
});

export default IssueForm;
