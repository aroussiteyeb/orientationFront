import {
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TextInput,
  StatusBar,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ToastAndroid
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { Avatar } from "react-native-elements";
import { auth, db } from "../../firebase";
import firebase from "firebase/compat/app";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import {useTheme} from '../hooks/';
import {useScreenOptions, useTranslation} from '../hooks';
import {useHeaderHeight} from '@react-navigation/stack';
import {Block, Button, Input, Image, Switch, Modal, Text} from '../components/';
import Storage from '@react-native-async-storage/async-storage';

export default function ChatScreen({ navigation, route }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const {assets, sizes,icons, colors, gradients} = useTheme();
  const headerHeight = useHeaderHeight();
  const isAndroid = Platform.OS === 'android';

  const showToastWithGravityAndOffset = (message :string ) => {
    ToastAndroid.showWithGravityAndOffset(
     message,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
    
      25,
      50
    );
  };

 /*  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chat",
      //headerBackTitleVisible: false,
      headerTitleAlign: "left",
      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            activeOpacity={0.5}
          >
            <Avatar
              rounded
              source={{
                uri: messages[0]?.data.photoURL,
              }}
            />
          </TouchableOpacity>

          <Text style={{ color: "#fff", marginLeft: 10, fontWeight: "700" }}>
            {route.params.chatName}
          </Text>
        </View>
      ),
      headerLeft: () => <TouchableOpacity></TouchableOpacity>,
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 80,
            marginRight: 20,
          }}
        >
          <TouchableOpacity>
            <FontAwesome name="video-camera" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="call" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, messages]);
  
 */

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View
          style={{
            paddingLeft:57,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
         

          <Text p white>
            #{route.params.chatName}
          </Text>
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
          <TouchableOpacity>
            <FontAwesome name="video-camera" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="call" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
      
      headerLeft: () => (
        <Button onPress={() => navigation.goBack()}>
          <Image
            radius={0}
            width={10}
            height={18}
            color={colors.white}
            source={icons.arrow}
            transform={[{rotate: '180deg'}]}
          />
        </Button>
      ),
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
  const getUserAvatar = async () => {
    // get Data from Storage
    try {
      const data = await Storage.getItem('avatar');
      if (data !== null) {
        console.log('test',data);
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  };
  const sendMessage = async () => {
  
let data = {"message":"free"}
    let res = await fetch('http://192.168.20.68:5000/spam/predict', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        {"message":input}
       ),
      
    }).then((response)=>response.json()) //   <------ this line 
    .then(async (response)=>{
      console.log(response)
      if (response.success==1){
        showToastWithGravityAndOffset(response.message)
      }else{(response.success==0)
        Keyboard.dismiss();
        const avatar = await Storage.getItem('avatar');
        const email = await Storage.getItem('email');
        const result = email.split('@')[0];
        db.collection("chats").doc(route.params.id).collection("messages").add({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          message: input,
          displayName:result,
          email: auth.currentUser.email,
          photoURL: avatar,
        });
        setInput("");
      }
      //return response ;
    });
   
  };

  useLayoutEffect(() => {
    const unSubscribe = db
      .collection("chats")
      .doc(route.params.id)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
    return unSubscribe;
  }, [route]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <StatusBar style="light" />
      <KeyboardAvoidingView
        keyboardVerticalOffset={90}
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <ScrollView contentContainerStyle={{ paddingTop: 15 }}>
              {messages.map(({ id, data }) =>
                data.email === auth.currentUser.email ? (
                  <View key={id} style={styles.receiver}>
                    <Avatar
                      position="absolute"
                      containerStyle={{
                        position: "absolute",
                        bottom: -15,
                        right: -5,
                      }}
                      rounded
                      bottom={-15}
                      right={-5}
                      size={30}
                      source={{
                        uri: data.photoURL,
                      }}
                    />
                    <Text style={styles.receiverText}>{data.message}</Text>
                  </View>
                ) : (
                  <View key={id} style={styles.sender}>
                    <Avatar
                      position="absolute"
                      containerStyle={{
                        position: "absolute",
                        bottom: -15,
                        left: -5,
                      }}
                      rounded
                      bottom={-15}
                      left={-5}
                      size={30}
                      source={{
                        uri: data.photoURL,
                      }}
                    />
                    <Text style={styles.senderText}>{data.message}</Text>
                    <Text style={styles.senderName}>{data.displayName}</Text>
                  </View>
                )
              )}
            </ScrollView>
            <View style={styles.footer}>
              <TextInput
                value={input}
                onChangeText={(text) => setInput(text)}
                onSubmitEditing={sendMessage}
                placeholder="Single Message"
                style={styles.textInput}
              />
              <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
                <Ionicons name="send" size={24} color="#EE1A9C" />
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    borderColor: "transparent",
    backgroundColor: "#ECECEC",
    //borderWidth: 1,
    padding: 10,
    color: "gray",
    borderRadius: 30,
  },

  senderText: {
    color: "#fff",
    fontWeight: "500",
    marginLeft: 10,
    marginBottom: 15,
  },

  senderName: {
    left: 10,
    paddingRight: 10,
    fontSize: 10,
    color: "#fff",
  },
  receiver: {
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },
  sender: {
    padding: 15,
    backgroundColor: "#EECEE2",
    alignSelf: "flex-start",
    borderRadius: 20,
    margin: 15,
    maxWidth: "80%",
    position: "relative",
  },
  receiverText: {
    color: "#000",
    fontWeight: "500",
    marginLeft: 10,
  },
});
