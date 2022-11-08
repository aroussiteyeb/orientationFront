import React, { useContext, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Avatar, Button, useTheme, withTheme } from "react-native-paper";
import { StackActions } from "@react-navigation/native";

//import { AuthContext } from "../context/AuthContext";

const UserAvatar = ({ navigation, theme }) => {
  //const { logout, loggedIn, userData } = useContext(AuthContext);
  const { colors } = useTheme();
  useEffect(() => {
   /*  if (loggedIn === false) {
      navigation.dispatch(StackActions.replace("Login"));
    } */
  }, [/* loggedIn */]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
    
        <View style={styles.userContainer}>
          <Avatar.Image size={100} source={{ uri: '' }} />
          <View style={styles.textContainer}>
            <Text>aroussi</Text>
          </View>
        </View>
     

      <Button mode="contained" >
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingRight: 30,
    paddingLeft: 30,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  userContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  textContainer: {
    marginTop: 10
  },
});

export default UserAvatar;