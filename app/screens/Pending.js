import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Swipeable from "react-native-gesture-handler/Swipeable";
import {
	Alert,
	Image,
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";

import AppButton from "../components/AppButton";
import colors from "../config/colors";
import Screen from "../components/Screen";
import { setTaskID, setTasks } from "../redux/actions";

export default function Pending({ navigation }) {
	const { tasks } = useSelector((state) => state.taskReducer);
	const dispatch = useDispatch();

	useEffect(() => {
		getTasks();
	}, []);

	const getTasks = async () => {
		await AsyncStorage.getItem("Tasks")
			.then((tasks) => {
				const fetchedTasks = JSON.parse(tasks);
				if (fetchedTasks && typeof fetchedTasks === "object")
					dispatch(setTasks(fetchedTasks));
			})
			.catch((err) => console.log(err));
	};

	const OnDeleteTask = (taskID) => {
		const filterTasks = tasks.filter((task) => task.ID !== taskID);
		// now store the filtered tasks in async storage instead of previous tasks
		AsyncStorage.setItem("Tasks", JSON.stringify(filterTasks))
			.then(() => {
				dispatch(setTasks(filterTasks));
				Alert.alert("Success!", "Task deleted successfully");
			})
			.catch((err) => console.log(err));
	};

	const markAsDone = (taskID, newValue) => {
		const index = tasks.findIndex((task) => task.ID === taskID);
		if (index > -1) {
			// if task in found first create a copy of tasks array & then change the value of checkbox in copied array
			let newTasks = [...tasks];
			newTasks[index].Completed = newValue;
			AsyncStorage.setItem("Tasks", JSON.stringify(newTasks))
				.then(() => {
					dispatch(setTasks(newTasks));
					Alert.alert("Success!", "Task status changed successfully");
				})
				.catch((err) => console.log(err));
		}
	};

	const LeftActions = () => {
		return (
			<View style={styles.leftAction}>
				<FontAwesome5 name={"check"} size={25} color={colors.white} />
			</View>
		);
	};
	const RightActions = () => {
		return (
			<View style={styles.rightAction}>
				<FontAwesome5 name={"trash"} size={25} color={colors.white} />
			</View>
		);
	};
	return (
		<>
			{tasks.filter((task) => task.Completed === false).length > 0 ? (
				<Screen>
					<View style={styles.container}>
						<FlatList
							data={tasks.filter(
								(task) => task.Completed === false
							)}
							renderItem={({ item }) => (
								<Swipeable
									friction={2}
									overshootLeft={false}
									overshootRight={false}
									renderLeftActions={LeftActions}
									onSwipeableLeftOpen={() =>
										markAsDone(item.ID, true)
									}
									renderRightActions={RightActions}
									onSwipeableRightOpen={() =>
										OnDeleteTask(item.ID)
									}>
									<TouchableOpacity
										style={styles.item}
										onPress={() => {
											// saving the taskID in that item in the state/store
											dispatch(setTaskID(item.ID));
											navigation.navigate("Task Details");
										}}>
										<View style={styles.item_row}>
											<View
												style={[
													{
														backgroundColor:
															item.Category ===
															"important"
																? colors.red
																: item.Category ===
																  "urgent"
																? colors.orange
																: item.Category ===
																  "personal"
																? colors.green
																: colors.white,
													},
													styles.category,
												]}
											/>
											{item.Image ? (
												<Image
													style={styles.image}
													source={{ uri: item.Image }}
												/>
											) : (
												<Image
													style={styles.image}
													source={require("../assets/images/pending.png")}
												/>
											)}
											{/* <Checkbox
												style={styles.checkbox}
												value={item.Completed}
												onValueChange={(newValue) =>
													markAsDone(
														item.ID,
														newValue
													)
												}
											/> */}
											<View style={styles.item_container}>
												<Text
													style={styles.title}
													numberOfLines={1}>
													{item.Title}
												</Text>
												<Text
													style={styles.desc}
													numberOfLines={1}>
													{item.Desc}
												</Text>
											</View>
											{/* <TouchableOpacity
												style={styles.delete}
												onPress={() =>
													OnDeleteTask(item.ID)
												}>
												<FontAwesome5
													name={"trash"}
													size={25}
													color={colors.primary}
												/>
											</TouchableOpacity> */}
										</View>
									</TouchableOpacity>
								</Swipeable>
							)}
							keyExtractor={(item, index) => index.toString()}
						/>

						<TouchableOpacity
							style={styles.button}
							onPress={() => {
								// in order to always get the latest taskID we use tasks state and add one to its length
								dispatch(setTaskID(tasks.length + 1));
								navigation.navigate("Task Details");
							}}>
							<FontAwesome5
								name={"pen"}
								size={20}
								color={colors.white}
							/>
						</TouchableOpacity>
					</View>
				</Screen>
			) : (
				<View style={styles.overlay}>
					<Image
						style={styles.gif}
						source={require("../assets/animation/overlay.gif")}
					/>
					<Text style={styles.notasks}>
						No such pending tasks! Add some tasks to list here.
					</Text>
					<AppButton
						title={
							<FontAwesome5
								name={"plus"}
								size={25}
								color={colors.white}
							/>
						}
						style={styles.createbutton}
						color={colors.primary}
						onPressFunction={() => {
							dispatch(setTaskID(tasks.length + 1));
							navigation.navigate("Task Details");
						}}
					/>
				</View>
			)}
		</>
	);
}

const styles = StyleSheet.create({
	button: {
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: colors.primary,
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		bottom: 10,
		right: 10,
		elevation: 4,
	},
	category: {
		width: 20,
		height: 100,
		borderTopLeftRadius: 10,
		borderBottomLeftRadius: 10,
	},
	checkbox: {
		marginLeft: 10,
	},
	container: {
		flex: 1,
	},
	createbutton: {
		marginTop: "10%",
	},
	delete: {
		width: 50,
		height: 50,
		justifyContent: "center",
		alignItems: "center",
	},
	desc: {
		color: "#999999",
		fontSize: 20,
		margin: 5,
		marginLeft: "5%",
	},
	image: {
		margin: 10,
		width: 120,
		height: 80,
	},
	item: {
		marginHorizontal: 10,
		marginVertical: 7,
		paddingRight: 10,
		backgroundColor: colors.white,
		justifyContent: "center",
		borderRadius: 10,
		elevation: 5,
	},
	item_row: {
		flexDirection: "row",
		alignItems: "center",
	},
	item_container: {
		flex: 1,
	},
	leftAction: {
		backgroundColor: colors.primary,
		justifyContent: "center",
		alignItems: "center",
		margin: 8,
		width: "25%",
		height: "85%",
		borderTopLeftRadius: 10,
		borderBottomLeftRadius: 10,
		marginRight: -20,
	},
	notasks: {
		fontSize: 12,
		color: colors.gray,
	},
	overlay: {
		flex: 1,
		paddingTop: "30%",
		alignItems: "center",
		backgroundColor: colors.white,
	},
	rightAction: {
		backgroundColor: colors.primary,
		justifyContent: "center",
		alignItems: "center",
		margin: 8,
		width: "25%",
		height: "85%",
		borderTopRightRadius: 10,
		borderBottomRightRadius: 10,
		marginLeft: -20,
	},
	title: {
		color: "#000000",
		fontSize: 30,
		margin: 5,
		marginLeft: "5%",
	},
});
