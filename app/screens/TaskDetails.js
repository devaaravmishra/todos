import React, { useEffect, useState } from "react";
import {
	Alert,
	Modal,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Image,
	ScrollView,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "expo-checkbox";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { TextInput } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import * as Notifications from "expo-notifications";
import * as FileSystem from "expo-file-system";

import AppButton from "../components/AppButton";
import colors from "../config/colors";
import Screen from "../components/Screen";
import { setTasks } from "../redux/actions";

export default function TaskDetails({ navigation }) {
	const { tasks, taskID } = useSelector((state) => state.taskReducer);
	const dispatch = useDispatch();

	const [title, setTitle] = useState("");
	const [desc, setDesc] = useState("");
	const [completed, setCompleted] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [category, setCategory] = useState("custom");
	const [notificationTime, setNotificationTime] = useState("1");
	const [image, setImage] = useState("");

	useEffect(() => {
		// capturing the new image and displying it over previous one didn't work to solve this problem
		// we make use of focus listener to detect return to previous page and retrieve the task info again
		navigation.addListener("focus", () => {
			getTask();
		});
	}, []);

	const getTask = () => {
		// purpose is to get the task from the tasks array and display its details in the form
		// finding the desired task from the list of tasks with taskID
		const task = tasks.find((task) => task.ID === taskID);
		if (task) {
			setTitle(task.Title);
			setDesc(task.Desc);
			// when we recieve info of task on this page, we set the completed checkbox to true
			setCompleted(task.Completed);
			// set the value of category to getTask function inside the state
			setCategory(task.Category);
			setImage(task.Image);
		}
	};

	const setTask = () => {
		if (title.length === 0) Alert.alert("Warning", "Title is required");
		else {
			try {
				var Task = {
					ID: taskID,
					Title: title,
					Desc: desc,
					Completed: completed,
					Category: category,
					Image: image,
				};
				const index = tasks.findIndex((task) => task.ID === taskID);
				let newTasks = [];
				if (index > -1) {
					newTasks = [...tasks];
					newTasks[index] = Task;
				} else {
					newTasks = [...tasks, Task];
				}
				AsyncStorage.setItem("Tasks", JSON.stringify(newTasks))
					.then(() => {
						console.log(newTasks);
						dispatch(setTasks(newTasks));
						Alert.alert("Success!", "Task saved successfully");
						navigation.goBack();
					})
					.catch((err) => console.log(err));
			} catch (error) {
				console.log(error);
			}
		}
	};

	const setNotificationTimer = () => {
		Notifications.setNotificationHandler({
			handleNotification: async () => ({
				shouldShowAlert: true,
				shouldPlaySound: true,
				shouldSetBadge: true,
			}),
		});

		const trigger = new Date(
			Date.now() + parseInt(notificationTime) * 60 * 1000
		);
		Notifications.scheduleNotificationAsync({
			identifier: "task-channel",
			content: {
				title: title,
				body: desc,
			},
			trigger,
		});
	};

	const onDeleteImage = async () => {
		const options = {
			idempotent: true,
		};
		await FileSystem.deleteAsync(image, options)
			// after deleting the file we also update it in the tasks array
			.then(() => {
				const index = tasks.findIndex((task) => task.ID === taskID);
				if (index > -1) {
					let newTasks = [...tasks];
					newTasks[index].Image = "";
					AsyncStorage.setItem("Tasks", JSON.stringify(newTasks))
						.then(() => {
							dispatch(setTasks(newTasks));
							// after updating the changes to task array we make use of getTasks function again to update the page
							getTask();
							Alert.alert(
								"Success!",
								"Image removed successfully"
							);
						})
						.catch((err) => console.log(err));
				}
			})
			.catch((err) => console.log(err));
	};

	return (
		<Screen>
			<ScrollView>
				<View style={styles.container}>
					<Modal
						visible={modalVisible}
						transparent
						onRequestClose={() => setModalVisible(false)}
						animationType="slide"
						hardwareAccelerated>
						<View style={styles.modal_container}>
							<View style={styles.modal_sub_container}>
								<View style={styles.modal_body}>
									<Text style={styles.text}>
										Remind me After
									</Text>
									<TextInput
										style={styles.modal_input}
										keyboardType="numeric"
										value={notificationTime}
										onChangeText={(time) =>
											setNotificationTime(time)
										}
									/>
									<Text style={styles.text}>minute(s)</Text>
								</View>
								<View style={styles.modal_buttons}>
									<TouchableOpacity
										style={styles.cancel_button}
										onPress={() => setModalVisible(false)}>
										<Text style={styles.text}>Cancel</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={styles.ok_button}
										onPress={() => {
											setModalVisible(false);
											setNotificationTimer();
										}}>
										<Text style={styles.text}>OK</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</Modal>
					<TextInput
						onChangeText={(text) => setTitle(text)}
						placeholder="Title"
						style={styles.input}
						value={title}
					/>
					<TextInput
						multiline
						onChangeText={(text) => setDesc(text)}
						placeholder="Description"
						style={styles.input}
						value={desc}
					/>
					<View style={styles.color}>
						<TouchableOpacity
							style={styles.category_custom}
							onPress={() => {
								setCategory("custom");
							}}>
							{category === "custom" && (
								<FontAwesome5
									name={"check"}
									size={20}
									color={colors.black}
								/>
							)}
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.category_important}
							onPress={() => {
								setCategory("important");
							}}>
							{category === "important" ? (
								<FontAwesome5
									name={"check"}
									size={20}
									color={colors.white}
								/>
							) : (
								<Text style={styles.category_text}>
									Important
								</Text>
							)}
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.category_urgent}
							onPress={() => {
								setCategory("urgent");
							}}>
							{category === "urgent" ? (
								<FontAwesome5
									name={"check"}
									size={20}
									color={colors.white}
								/>
							) : (
								<Text style={styles.category_text}>Urgent</Text>
							)}
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.category_personal}
							onPress={() => {
								setCategory("personal");
							}}>
							{category === "personal" ? (
								<FontAwesome5
									name={"check"}
									size={20}
									color={colors.white}
								/>
							) : (
								<Text style={styles.category_text}>
									Personal
								</Text>
							)}
						</TouchableOpacity>
					</View>
					<View style={styles.buttons_container}>
						<TouchableOpacity
							style={styles.buttons}
							onPress={() => setModalVisible(true)}>
							<FontAwesome5
								name={"bell"}
								size={20}
								color={colors.white}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.buttons}
							onPress={() => {
								navigation.navigate("Camera", { id: taskID });
							}}>
							<FontAwesome5
								name={"camera"}
								size={20}
								color={colors.white}
							/>
						</TouchableOpacity>
					</View>
					{image ? (
						<View>
							<Image
								style={styles.image}
								source={{ uri: image }}
							/>
							<TouchableOpacity
								style={styles.delete}
								onPress={() => onDeleteImage()}>
								<FontAwesome5
									name={"trash"}
									size={20}
									color={colors.primary}
								/>
							</TouchableOpacity>
						</View>
					) : null}
					<View style={styles.checkbox}>
						<Checkbox
							value={completed}
							onValueChange={(value) => setCompleted(value)}
						/>
						<Text style={styles.text}>Mark as completed</Text>
					</View>
					<AppButton
						title="Save"
						color={colors.primary}
						style={{ width: "100%" }}
						onPressFunction={setTask}
					/>
				</View>
			</ScrollView>
		</Screen>
	);
}

const styles = StyleSheet.create({
	buttons: {
		flex: 1,
		height: 50,
		backgroundColor: colors.primary,
		borderRadius: 10,
		marginHorizontal: 5,
		justifyContent: "center",
		alignItems: "center",
	},
	buttons_container: {
		flexDirection: "row",
		marginVertical: 10,
	},
	cancel_button: {
		flex: 1,
		borderRightWidth: 1,
		borderTopWidth: 1,
		borderColor: colors.gray,
		borderBottomLeftRadius: 20,
		justifyContent: "center",
		alignItems: "center",
	},
	category_custom: {
		flex: 1,
		backgroundColor: colors.white,
		justifyContent: "center",
		alignItems: "center",
		borderTopLeftRadius: 5,
		borderBottomLeftRadius: 5,
	},
	category_important: {
		flex: 1,
		backgroundColor: colors.red,
		justifyContent: "center",
		alignItems: "center",
	},
	category_personal: {
		flex: 1,
		backgroundColor: colors.green,
		justifyContent: "center",
		alignItems: "center",
		borderTopRightRadius: 5,
		borderBottomRightRadius: 5,
	},
	category_urgent: {
		flex: 1,
		backgroundColor: colors.orange,
		justifyContent: "center",
		alignItems: "center",
	},
	category_text: {
		color: colors.white,
	},
	checkbox: {
		flexDirection: "row",
		margin: 10,
		alignItems: "center",
	},
	color: {
		flexDirection: "row",
		height: 50,
		borderWidth: 1,
		borderRadius: 5,
		borderColor: colors.gray,
		marginVertical: 10,
	},
	container: {
		flex: 1,
		alignItems: "center",
		padding: 10,
	},
	delete: {
		width: 50,
		height: 50,
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		right: 20,
		bottom: 20,
		backgroundColor: "#ffffff80",
		margin: 10,
		borderRadius: 5,
	},
	input: {
		width: "100%",
		borderColor: "#555555",
		borderWidth: 1,
		borderRadius: 5,
		textAlign: "center",
		fontSize: 20,
		margin: 10,
		padding: 10,
	},
	image: {
		width: 300,
		height: 300,
		margin: 20,
	},
	modal_body: {
		height: 150,
		justifyContent: "center",
		alignItems: "center",
	},
	modal_buttons: {
		flexDirection: "row",
		height: 50,
	},
	modal_input: {
		width: 100,
		borderWidth: 1,
		borderColor: colors.gray,
		borderRadius: 10,
		backgroundColor: colors.white,
		textAlign: "center",
		fontSize: 30,
		margin: 10,
	},
	modal_container: {
		flex: 1,
		backgroundColor: "#00000099",
		justifyContent: "center",
		alignItems: "center",
	},
	modal_sub_container: {
		width: 300,
		height: 200,
		backgroundColor: colors.white,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: "#000000",
	},
	ok_button: {
		flex: 1,
		borderLeftWidth: 1,
		borderTopWidth: 1,
		borderColor: colors.gray,
		borderBottomRightRadius: 20,
		justifyContent: "center",
		alignItems: "center",
	},
	text: {
		marginLeft: 10,
		fontSize: 20,
		color: "#000000",
	},
});
