import * as Font from "expo-font";

export default useFonts = async () =>
	await Font.loadAsync({
		JosefinSans: require("../assets/fonts/JosefinSans-Bold.ttf"),
	});
