import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet, Image } from "react-native";
import React, { useEffect, useState, useCallback } from "react";

import useFonts from "../hooks/useFonts";

export default function Splash({ navigation }) {
	const [isReady, setIsReady] = useState(false);

	const createChannels = () => {
		const NotificationChannelGroupInput = {
			name: "Task Channel",
		};
		Notifications.setNotificationChannelAsync(
			"task-channel",
			NotificationChannelGroupInput
		)
			.then(() => {
				console.log("Notification Channels created");
			})
			.catch((err) => console.log(err));
	};

	useEffect(() => {
		const prepare = async () => {
			createChannels();
			await SplashScreen.preventAutoHideAsync();
			if (!isReady) await useFonts();
			setTimeout(() => {
				navigation.replace("todo's");
			}, 2000);
			setIsReady(true);
		};
		prepare();
	}, []);

	const onLayoutRootView = useCallback(async () => {
		if (isReady) {
			await SplashScreen.hideAsync();
		}
	}, [isReady]);

	if (!isReady) {
		return null;
	}

	return (
		<View style={styles.container} onLayout={onLayoutRootView}>
			<StatusBar
				backgroundColor="#3a3a3a"
				style="light"
				translucent={true}
			/>
			<Image
				style={styles.logo}
				source={require("../assets/animation/splash.gif")}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#3a3a3a",
	},
	logo: {
		width: 280,
		height: 520,
		margin: 20,
	},
	text: {
		fontSize: 40,
		color: "#ffffff",
	},
});
