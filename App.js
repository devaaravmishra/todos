import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import React from "react";
import { StatusBar } from "expo-status-bar";

import Camera from "./app/screens/Camera";
import colors from "./app/config/colors";
import Completed from "./app/screens/Completed";
import HeaderBarIcon from "./app/components/HeaderBarIcon";
import Pending from "./app/screens/Pending";
import Splash from "./app/screens/Splash";
import TaskDetails from "./app/screens/TaskDetails";
import Screen from "./app/components/Screen";
import { Store } from "./app/redux/store";

const Tab = createBottomTabNavigator();

function HomeTabs() {
	return (
		<Tab.Navigator
			initialRouteName="Pending"
			screenOptions={({ route }) => ({
				tabBarIcon: ({ color, size }) => {
					let iconName;

					route.name === "Pending"
						? (iconName = "calendar-times")
						: (iconName = "calendar-check");
					return (
						<FontAwesome5
							name={iconName}
							size={size}
							color={color}
						/>
					);
				},
				tabBarShowLabel: false,
				tabBarActiveTintColor: colors.primary,
				tabBarInactiveTintColor: colors.gray,
				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: "bold",
					paddingBottom: "2%",
				},
				tabBarStyle: [
					{
						display: "flex",
						height: "7%",
					},
					null,
				],
			})}>
			<Tab.Screen
				name="Completed"
				component={Completed}
				options={{
					headerShown: false,
				}}
			/>
			<Tab.Screen
				name="Pending"
				component={Pending}
				options={{
					headerShown: false,
				}}
			/>
		</Tab.Navigator>
	);
}

const RootStack = createStackNavigator();

export default function App() {
	return (
		<Provider store={Store}>
			<Screen>
				<StatusBar translucent={true} />
				<NavigationContainer>
					<RootStack.Navigator
						initialRouteName="Splash"
						screenOptions={{
							headerStyle: {
								backgroundColor: colors.white,
							},
							headerTitleAlign: "center",
							headerTintColor: colors.primary,
							headerTitleStyle: {
								fontFamily: "JosefinSans",
								fontSize: 40,
							},
							headerLeft: () => <HeaderBarIcon path={"todo's"} />,
						}}>
						<RootStack.Screen
							name="Splash"
							component={Splash}
							options={{ headerShown: false }}
						/>
						{/* making bottom tab navigator a part of landing tasks screen */}
						<RootStack.Screen name="todo's" component={HomeTabs} />
						<RootStack.Screen
							name="Task Details"
							component={TaskDetails}
							options={{
								headerTitleStyle: {
									fontFamily: "JosefinSans",
									fontSize: 30,
								},
							}}
						/>
						<RootStack.Screen
							name="Camera"
							component={Camera}
							options={{ headerShown: false }}
						/>
					</RootStack.Navigator>
				</NavigationContainer>
			</Screen>
		</Provider>
	);
}
