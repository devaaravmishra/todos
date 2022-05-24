import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { View, StyleSheet, Alert, Text } from "react-native";
import { Camera, CameraType } from "expo-camera";
import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

import colors from "../config/colors";
import { setTasks } from "../redux/actions";
import { useDispatch, useSelector } from "react-redux";

export default function CameraScreen({ navigation, route }) {
	const { tasks } = useSelector((state) => state.taskReducer);
	const dispatch = useDispatch();

	const [camera, setCamera] = useState(null);
	const [hasPermission, setHasPermission] = useState(null);
	const [type, setType] = useState(CameraType.back);

	useEffect(() => {
		(async () => {
			const { status } = await Camera.requestCameraPermissionsAsync();
			setHasPermission(status === "granted");
		})();
	}, []);

	if (hasPermission === null) {
		return <View />;
	}
	if (hasPermission === false) {
		return <Text>No access to camera</Text>;
	}

	const handleCapture = async () => {
		try {
			const options = {
				quality: 0.5,
				exif: false,
			};
			const image = await camera.takePictureAsync(options);
			const imagePath = image.uri;
			updateTask(route.params.id, imagePath);
		} catch (error) {
			console.log(error);
		}
	};

	const updateTask = (id, path) => {
		const index = tasks.findIndex((task) => task.ID === id);
		if (index > -1) {
			let newTasks = [...tasks];
			newTasks[index].Image = path;
			AsyncStorage.setItem("Tasks", JSON.stringify(newTasks))
				.then(() => {
					dispatch(setTasks(newTasks));
					Alert.alert("Success!", "Task image is saved.");
					navigation.goBack();
				})
				.catch((err) => console.log(err));
		}
	};

	return (
		<View style={styles.container}>
			<Camera
				type={type}
				style={styles.preview}
				ref={(ref) => setCamera(ref)}>
				<TouchableOpacity
					style={styles.button}
					color={colors.primary}
					onPress={() => handleCapture()}>
					<FontAwesome5
						name={"camera"}
						size={20}
						color={colors.white}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.button}
					color={colors.primary}
					onPress={() =>
						setType(
							type === CameraType.back
								? CameraType.front
								: CameraType.back
						)
					}>
					<FontAwesome5
						name={"exchange-alt"}
						size={20}
						color={colors.white}
					/>
				</TouchableOpacity>
			</Camera>
		</View>
	);
}

const styles = StyleSheet.create({
	button: {
		width: 100,
		height: 50,
		backgroundColor: colors.primary,
		borderRadius: 10,
		marginHorizontal: 5,
		justifyContent: "center",
		alignItems: "center",
	},
	container: {
		flex: 1,
	},
	preview: {
		flex: 1,
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "center",
		paddingTop: "150%",
	},
});
