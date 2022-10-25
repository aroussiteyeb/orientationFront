import { View, StyleSheet } from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import {useTheme} from '../hooks/';

import { SafeAreaView, ScrollView } from "react-native";
import CustomListitem from "../components/CustomListitem";
import { Avatar } from "react-native-elements";
import { auth, db } from "../../firebase";
import { TouchableOpacity } from "react-native";
import {Block, Button, Input, Image, Switch, Modal, Text} from '../components/';
import {useScreenOptions, useTranslation} from '../hooks';
import {useHeaderHeight} from '@react-navigation/stack';

export default function Chats({ navigation }) {
  const [chats, setChats] = useState([]);
  const screenOptions = useScreenOptions();
  const {assets, sizes} = useTheme();
  const headerHeight = useHeaderHeight();
  const signOutUser = () => {
    auth.signOut().then(() => {
      navigation.replace("Home");
    });
  };

  useEffect(() => {
    const unsubscribe = db.collection("chats").onSnapshot((snapShot) =>
      setChats(
        snapShot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      ),
    );
    return unsubscribe;
  }, []);

/*   useLayoutEffect(() => {
     navigation.setOptions({
      
      title: "Chat",
      headerStyle: { backgroundColor: "#fff" },
      headerTitleStyle: { color: "#000" },
      headerTinColor: "#000",
      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <TouchableOpacity onPress={signOutUser} activeOpacity={0.5}>
            <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }} />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 80,
            marginRight: 20,
          }}
        >
          <TouchableOpacity activeOpacity={0.5}>
            <AntDesign name="camerao" size={24} color="#000" />

          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("AddChat")}
            activeOpacity={0.5}
          >
            <SimpleLineIcons name="pencil" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      ),
    }); 
  }, [navigation]); */

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackground: () => (
        <Image
          radius={0}
          resizeMode="cover"
          width={sizes.width}
          height={headerHeight}
          source={assets.header}
        />
      ),
    });
  }, [assets.header, navigation, sizes.width, headerHeight]);


  const enterChat = (id, chatName) => {
    navigation.navigate("Chat", {
      id,
      chatName,
    });
  };

  return (
    <SafeAreaView>
      
      <ScrollView style={styles.container}>
        {chats.map(({ id, data: { chatName } }) => (
          <CustomListitem
            key={id}
            id={id}
            chatName={chatName}
            enterChat={enterChat}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
});
