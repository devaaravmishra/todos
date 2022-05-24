import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import React from "react";
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

import AppButton from "../components/AppButton";
import colors from "../config/colors";
import Screen from "../components/Screen";
import { setTaskID, setTasks } from "../redux/actions";

export default function Completed({ navigation }) {
	const { tasks } = useSelector((state) => state.taskReducer);
	const dispatch = useDispatch();

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
				<FontAwesome5
					name={"minus-circle"}
					size={25}
					color={colors.white}
				/>
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
			{tasks.filter((task) => task.Completed === true).length === 0 ? (
				<View style={styles.overlay}>
					<Image
						style={styles.gif}
						source={require("../assets/animation/overlay.gif")}
					/>
					<Text style={styles.notasks}>
						No such completed tasks! Complete some tasks to list
						here.
					</Text>
					<AppButton
						title={
							<FontAwesome5
								name={"arrow-right"}
								size={25}
								color={colors.white}
							/>
						}
						style={styles.button}
						color={colors.primary}
						onPressFunction={() => navigation.navigate("Pending")}
					/>
				</View>
			) : (
				<Screen>
					<View style={styles.container}>
						<FlatList
							data={tasks.filter(
								(task) => task.Completed === true
							)}
							renderItem={({ item }) => (
								<Swipeable
									friction={2}
									overshootLeft={false}
									overshootRight={false}
									renderLeftActions={LeftActions}
									onSwipeableLeftOpen={() =>
										markAsDone(item.ID, false)
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
													source={require("../assets/images/complete.png")}
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
													color={"#984AE8"}
												/>
											</TouchableOpacity> */}
										</View>
									</TouchableOpacity>
								</Swipeable>
							)}
							keyExtractor={(item, index) => index.toString()}
						/>
					</View>
				</Screen>
			)}
		</>
	);
}

const styles = StyleSheet.create({
	button: {
		marginTop: "10%",
	},
	category: {
		width: 20,
		height: 100,
		borderTopLeftRadius: 10,
		borderBottomLeftRadius: 10,
	},
	container: {
		flex: 1,
	},
	checkbox: {
		marginLeft: 10,
	},
	delete: {
		width: 50,
		height: 50,
		justifyContent: "center",
		alignItems: "center",
	},
	desc: {
		color: colors.mediumgray,
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
		color: colors.black,
		fontSize: 30,
		margin: 5,
		marginLeft: "5%",
	},
});
