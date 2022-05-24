import { TouchableOpacity } from "react-native";
import React from "react";
import { StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

function HeaderBarIcon({ path }) {
	const navigation = useNavigation();
	return (
		<TouchableOpacity onPress={() => navigation.navigate(path)}>
			<Image
				source={require("../assets/images/logo.png")}
				style={styles.icon}
			/>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	icon: {
		width: 60,
		height: 100,
		marginTop: 20,
		marginLeft: 10,
	},
});

export default HeaderBarIcon;
