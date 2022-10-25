import { View, StyleSheet } from "react-native";
import React, { useLayoutEffect, useState } from "react";
//import { Button, Input, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { db } from "../../firebase";
import { Block, Button, Input, Image, Text, Checkbox } from '../components';
import { useData, useTheme, useTranslation } from '../hooks/';
import ProgressDialog from 'react-native-progress-dialog';

export default function AddChatScreen({ navigation }) {
  const [input, setInput] = useState("");
  const [loading, setloading] = useState(false);

  const { assets, colors, gradients, sizes } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add a New Chat",
      headerBackTitle: "Chat",
    });
  }, [navigation]);

  const createChat = async () => {
    setloading(true)
    await db
      .collection("chats")
      .add({
        chatName: input,
      })
      .then(() => {
        setloading(false)
        navigation.goBack();
      })
      .catch((error) => alert(error));
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Enter a Chat Name"
        value={input}
        onChangeText={(text) => setInput(text)}
        onSubmitEditing={createChat}
        leftIcon={
          <Icon name="wechat" type="antdesign" size={24} color="#000" />
        }
      />
           <Button
                onPress={createChat}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                gradient={gradients.primary}
               
                disabled={!input}>
                <Text bold white transform="uppercase">
                 Create chat
                </Text>
              </Button>
              <ProgressDialog loaderColor='#EE1A9C'  visible={loading}/>

      {/* <Button
        disabled={!input}
        onPress={createChat}
        title="Create a new Chat"
      ></Button> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 30,
    height: "100%",
  },
});
