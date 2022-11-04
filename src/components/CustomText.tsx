import React from "react";
import { Text } from "react-native";

export const BoltLightText = ({ children, style, ...props }) => {
	return (
		<Text {...props} style={{ ...style }}>
			{children}
		</Text>
	);
};

export const BoltSemiBoldText = ({ children, style, ...props }) => {
	return (
		<Text {...props} style={{ ...style}}>
			{children}
		</Text>
	);
};

