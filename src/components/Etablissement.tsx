import React, { useState, useRef, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
  Platform,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';

import { useNavigation } from '@react-navigation/core';
import { Block, Button, Input, Image, Switch, Modal, Text, MapVieww } from '../components/';
import { useTheme } from '../hooks/';
import Carousel from 'react-native-reanimated-carousel';

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
//import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import tw from "tailwind-react-native-classnames";
import { BoltLightText, BoltSemiBoldText } from "../components/CustomText";
import { useValue } from "react-native-reanimated";
// import { interpolate, Extrapolate } from "react-native-reanimated";
// import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IEtablissment } from "../constants/types";

const IMAGE_WIDTH = 290;

const Etablissement = (
  {
    etablissment,
    filieres,
    parcours,
  }: IEtablissment
) => {
  const width = Dimensions.get('window').width;

  const navigation = useNavigation();
  const { assets, colors, gradients, sizes } = useTheme();
  const [visible, setVisible] = useState(false);
  const hideMenu = () => setVisible(false);
  const IMAGE_SIZE = (sizes.width - (sizes.padding + sizes.sm) * 2) / 3;
  const IMAGE_VERTICAL_SIZE =
    (sizes.width - (sizes.padding + sizes.sm) * 2) / 2;
  const IMAGE_MARGIN = (sizes.width - IMAGE_SIZE * 3 - sizes.padding * 2) / 2;
  const IMAGE_VERTICAL_MARGIN =
    (sizes.width - (IMAGE_VERTICAL_SIZE + sizes.sm) * 2) / 2;
  const showMenu = () => setVisible(true);
  //const { banner, name, rating, price, menu } = route.params;
  const scrollY = useRef(new Animated.Value(0.01)).current;
  const [toggleBar, setToggleBar] = useState(false);
  const searchBarAnim = useRef(
    new Animated.Value(
      Platform.OS === "android"
        ? 0 - Constants.statusBarHeight * 6
        : 0 - Constants.statusBarHeight * 3
    )
  ).current;

  useEffect(() => {
    console.log(parcours)
    if (toggleBar) {
      Animated.timing(searchBarAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(searchBarAnim, {
        toValue:
          Platform.OS === "android"
            ? 0 - Constants.statusBarHeight * 6
            : 0 - Constants.statusBarHeight * 3,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [toggleBar]);

  const mapView = () => {
    console.log('map')
   

  }
  // render card for Popular
  return (
    <View style={tw`flex relative bg-white`}>
      <Animated.View
        style={tw.style(
          "bg-white w-full absolute flex items-center px-5 shadow-lg",
          /*  {
             transform: [{ translateY: searchBarAnim }],
             zIndex: 100,
             elevation: 10000,
             paddingTop: Constants.statusBarHeight,
           } */
        )}
      >
        <View
          style={tw.style(
            "flex flex-col w-full justify-between h-full pt-5",
            {
              zIndex: 100,
              elevation: 100,
            }
          )}
        >
          <View
            style={tw.style(
              "w-full flex pt-1 flex-row justify-between pb-2.5",
              {
                // "items-center": Platform.OS === "android",
                // "justify-between flex-row": Platform.OS === "ios",
              }
            )}
          >
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                name="ios-arrow-back-outline"
                size={24}
                color="black"
              />
            </TouchableOpacity>

            <BoltSemiBoldText
              style={tw.style(
                "my-auto text-black my-auto mx-auto",
                {
                  fontSize:
                    Platform.OS === "ios"
                      ? 20
                      : Dimensions.get("window").width /
                      25,
                }
              )}
            >
              {etablissment.nameEtablisement}
            </BoltSemiBoldText>

            <Ionicons
              name="ios-arrow-back-outline"
              size={24}
              color="white"
            />
          </View>
        </View>
      </Animated.View>

      <View style={tw.style("flex bg-white h-full")}>
        <View
          style={tw.style("w-full relative", {
            zIndex: 400,
            elevation: 400,
          })}
        >
          <View
            style={{
              ...tw`w-full absolute items-center`,
              zIndex: 400,
              elevation: 10000,
              marginTop: Constants.statusBarHeight,

              // paddingTop:
              // 	Platform.OS === "android"
              // 		? Constants.statusBarHeight
              // 		: 0,
            }}
          >
            <View
              style={tw.style(
                "flex px-5 flex-row w-full absolute justify-between",
                {
                  zIndex: 100,
                  elevation: 100,
                }
              )}
            >
              <TouchableOpacity
                onPress={() => navigation.goBack()}
              >
                <Ionicons
                  name="ios-arrow-back-outline"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          </View>
          <Animated.Image
            style={{
              ...tw`w-full top-0`,
              ...StyleSheet.absoluteFillObject,
              height: IMAGE_WIDTH / 1.6,
              transform: [
                {
                  translateY: scrollY.interpolate({
                    inputRange: [0, IMAGE_WIDTH],
                    outputRange: [0, -IMAGE_WIDTH],
                    extrapolate: "clamp",
                  }),
                },
                {
                  scale: scrollY.interpolate({
                    inputRange: [-IMAGE_WIDTH * 2, 0],
                    outputRange: [5, 1],
                    extrapolate: "clamp",
                  }),
                },
              ],
            }}
            source={require("../assets/images/map.jpeg")}
          />
        </View>

        <Animated.ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            {
              useNativeDriver: true,
              listener: (event) => {
                const offsetY =
                  event.nativeEvent;
                console.log(offsetY);
                if (offsetY > 60) {
                  setToggleBar(true);
                } else {
                  setToggleBar(false);
                }
              },
            }
          )}
          contentContainerStyle={{ flexGrow: 1 }}
          scrollEventThrottle={16}
          style={tw`px-5 pt-5`}
        >
          <View
            style={tw.style({
              marginTop: IMAGE_WIDTH / 1.6,
            })}
          >
            <View
              style={tw`w-full flex flex-row justify-between items-start`}
            >
              <BoltSemiBoldText
                style={tw.style("text-lg flex w-2/3", {
                  flexWrap: "wrap",
                })}
              >
                {etablissment.nameFiliere}
              </BoltSemiBoldText>
            </View>

            <View
              style={tw`w-full mt-1 flex flex-row justify-between`}
            >
              <BoltLightText style={tw`text-gray-800`}>
                {etablissment.ville} ,{etablissment.region}
              </BoltLightText>
            </View>
            <View style={tw`w-full mt-5 flex flex-col`}>


              <Button flex={1} gradient={gradients.primary} marginBottom={sizes.base} onPress={mapView}>
                <Text white bold transform="uppercase">
                  View in map
                </Text>
              </Button>
              <Button flex={1} gradient={gradients.secondary} marginBottom={sizes.base}>
                <Text white bold transform="uppercase">
                  select
                </Text>
              </Button>
            </View>
          </View>

          <View style={tw.style("mt-10 w-4/5", {})}>
            <View style={tw`w-full flex flex-col`}>
              <BoltSemiBoldText
                style={tw.style("text-lg", {
                  flexWrap: "wrap",
                })}
              >
                Etablissment :
              </BoltSemiBoldText>
              <BoltLightText
                style={tw.style("text-gray-700 mt-1.5", {
                  flexWrap: "wrap",
                  fontSize: 16,
                })}
              >
                {etablissment.nameEtablisement}

              </BoltLightText>
            </View>
          </View>
          <View style={tw.style("mt-10 w-4/5", {})}>
            <View style={tw`w-full flex flex-col`}>
              <BoltSemiBoldText
                style={tw.style("text-lg", {
                  flexWrap: "wrap",
                })}
              >
                Domaine :
              </BoltSemiBoldText>
              <BoltLightText
                style={tw.style("text-gray-700 mt-1.5", {
                  flexWrap: "wrap",
                  fontSize: 16,
                })}
              >
                <View>
                  {filieres.map((value) => {
                    //console.log(value)
                    return (
                      value.domaine.map((dom) => {
                        return (
                          <View>
                            <Text>{dom.namedomaine}</Text>
                          </View>
                        );
                        //console.log(dom.namedomaine)
                        //<Text>{dom.namedomaine}</Text>
                      })
                    )

                  })}
                </View>


              </BoltLightText>
            </View>
          </View>
          <View style={tw.style("mt-10 w-4/5", {})}>
            <View style={tw`w-full flex flex-col`}>
              <BoltSemiBoldText
                style={tw.style("text-lg", {
                  flexWrap: "wrap",
                })}
              >
                Parcours
              </BoltSemiBoldText>

              <View style={tw`flex flex-col`}>
                {parcours.map((item, index) => (
                  <View
                    style={tw`w-full flex flex-row justify-between`}
                    key={index}
                  >
                    <BoltLightText
                      style={tw.style(
                        "text-gray-700 mt-1.5",
                        {
                          flexWrap: "wrap",
                          fontSize: 16,
                        }
                      )}
                    >

                      {item.nameparcours}
                    </BoltLightText>
                    <BoltLightText
                      style={tw.style(
                        "text-gray-700 mt-1.5",
                        {
                          flexWrap: "wrap",
                          fontSize: 16,
                        }
                      )}
                    >
                      <Menu
                        visible={visible}
                        anchor={<Button onPress={showMenu}>
                          <Text p primary semibold>
                            Show bac info
                          </Text>
                        </Button>}
                        onRequestClose={hideMenu}
                      >
                        <View>
                          {item.typeBac.map((value) => {
                            return (
                              <View>
                                <MenuItem onPress={hideMenu}> <Text p primary semibold>Bac : {value.type} , score:{value.score}</Text></MenuItem>
                              </View>
                            );

                          })}
                        </View>


                      </Menu>
                    </BoltLightText>
                  </View>
                ))}
                <Block marginTop={sizes.m} paddingHorizontal={sizes.padding}>
                  <Text p semibold marginBottom={sizes.s}>
                    Galery :
                  </Text>

                  {/* carousel example */}
                  <Block marginBottom={sizes.xxl}>
                    <View style={{ flex: 1 }}>

                      <Carousel
                        loop
                        width={width}
                        height={width / 2}
                        autoPlay={true}
                        data={[...new Array(etablissment.galorie.length).keys()]}
                        scrollAnimationDuration={1000}
                        //onSnapToItem={(index) => console.log('current index:', index)}
                        renderItem={({ index }) => (
                          //console.log(etablissment.galorie[0].path),
                          <View>

                            <Image
                              resizeMode="cover"
                              source={{ uri: etablissment.galorie[index].path }}

                              style={{ width: '90%', height: '100%' }}
                            />
                          </View>
                        )}
                      />
                    </View>
                    {/* <View>
                      <Text>{index}</Text>
                         <Image
          resizeMode="cover"
         source={{uri:etablissment.galorie[0].path}}
          style={{width: '90%'}}
        />
                    </View>
                      
                )}
            />
        </View> */}

                  </Block>
                  {/* photo gallery */}

                </Block>
              </View>
            </View>
          </View>
        </Animated.ScrollView>
      </View>
    </View>
  );

};

export default Etablissement;
