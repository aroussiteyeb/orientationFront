import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Platform, ToastAndroid, View } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import firebase from "firebase/compat/app/";
import uuid from "uuid";

import { useData, useTheme, useTranslation } from '../hooks/';
import * as regex from '../constants/regex';
import { Block, Button, Input, Image, Text, Checkbox } from '../components/';
import axios from 'axios';
import { Avatar } from 'react-native-paper';
import Icon from "react-native-vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker"
import styles from '../components/styles';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ProgressDialog from 'react-native-progress-dialog';


const isAndroid = Platform.OS === 'android';

interface IRegistration {
  confirmPassword: string;
  email: string;
  password: string;
  agreed: boolean;
}
interface IRegistrationValidation {
  confirmPassword: boolean;
  email: boolean;
  password: boolean;
  agreed: boolean;
}

const Register = () => {
  const { isDark } = useData();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { user } = useData();
  const [image, setImage] = useState(null)
  const [userAvatar, setUserAvatar] = useState('')
  const [loading, setloading] = useState(false);

  const [uploading, setUploading] = useState(false)
  const [isValid, setIsValid] = useState<IRegistrationValidation>({
    confirmPassword: false,
    email: false,
    password: false,
    agreed: false,
  });
  const [registration, setRegistration] = useState<IRegistration>({
    confirmPassword: '',
    email: '',
    password: '',
    agreed: false,
  });
  const { assets, colors, gradients, sizes } = useTheme();

  const handleChange = useCallback(
    (value) => {
      setRegistration((state) => ({ ...state, ...value }));
    },
    [setRegistration],
  );

  const showToastWithGravityAndOffset = (message: string) => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,

      25,
      50
    );
  };

  const handleSignUp = useCallback(() => {

   
    if (!Object.values(isValid).includes(false)) {

      const data = {
        "email": registration.email,
        "password": registration.password,
        "confirmPassword": registration.confirmPassword,
        "avatar": userAvatar

      }


      axios.post(`http://192.168.43.52:5000/users/signup`, data)
        .then(res => {
          console.log("hh", res.data)
          if (res.data.error == true) {
            showToastWithGravityAndOffset(res.data.message)
          } else {
            (res.data.success == true)
            showToastWithGravityAndOffset(res.data.message)
            navigation.navigate('Pro')
          }


        }).catch(error => console.log(error));


      axios.post(`http://192.168.43.52:5000/users/signup`, data)
      .then(res => {
        console.log("hh",res.data)
      if (res.data.error==true){
        showToastWithGravityAndOffset(res.data.message)
      }else{(res.data.success==true)
        showToastWithGravityAndOffset(res.data.message)
        navigation.navigate('Pro')}

      
      }).catch(error=>console.log(error));
      

      console.log('handleSignUp', registration);
    }
  }, [isValid, registration]);

  useEffect(() => {

    setIsValid((state) => ({
      ...state,
      confirmPassword: regex.confirmPassword.test(registration.confirmPassword),
      email: regex.email.test(registration.email),
      password: regex.password.test(registration.password),
      agreed: registration.agreed,
    }));
  }, [registration, setIsValid]);


  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setloading(true)
      setImage(result.uri);

      uploadImage(result.uri)

    }
  };

  const uploadImage = async (ur) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', ur, true);
      xhr.send(null);
    })
    const fileRef = ref(getStorage(), uuid.v4());
    const result = await uploadBytes(fileRef, blob);

    // We're done with the blob, close and release it
    let url = await getDownloadURL(fileRef).then((downloadURL) => {
      setUserAvatar(downloadURL)
      setTimeout(() => {
        console.log(userAvatar)
        setloading(false)

      }, 500);

    });
    //setUserAvatar(url)
    //setUserAvatar(url)

    blob.close();

  }
  return (
    <Block safe marginTop={sizes.md}>
    <ProgressDialog label='waiting for image upload' loaderColor='#EE1A9C'  visible={loading}/>

      <Block paddingHorizontal={sizes.s}>
        <Block flex={0} style={{ zIndex: 0 }}>

          <Image
            background
            resizeMode="cover"
            padding={sizes.sm}
            radius={sizes.cardRadius}
            source={assets.background}
            height={sizes.height * 0.3}>
            {/* <Button
              row
              flex={0}
              justify="flex-start"
              onPress={() => navigation.goBack()}>
              <Image
                radius={0}
                width={10}
                height={18}
                color={colors.white}
                source={assets.arrow}
                transform={[{rotate: '180deg'}]}
              />
              <Text p white marginLeft={sizes.s}>
                {t('common.goBack')}
              </Text>
            </Button> */}


            <Block flex={0} align="center" marginTop={20}>
              <Icon name="edit" type="antdesign" size={24} style={{ marginLeft: 100 }} color="#fff" onPress={() => pickImage()} />
              {image!== null? <Avatar.Image size={130} source={{ uri: image }} />
              
                   : <Avatar.Image size={100} source={require('../assets/images/defaultAvatar.jpeg')} />}




            </Block>
          </Image>

        </Block>

        {/* register form */}
        <Block
          keyboard
          behavior={!isAndroid ? 'padding' : 'height'}
          marginTop={-(sizes.height * 0.13 - sizes.l)}>
          <Block
            flex={0}
            radius={sizes.sm}
            marginHorizontal="8%"
            shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
          >
            <Block
              blur
              flex={0}
              intensity={90}
              radius={sizes.sm}
              overflow="hidden"
              justify="space-evenly"
              tint={colors.blurTint}
              paddingVertical={sizes.sm}>
              <Text p semibold center>
                {t('register.subtitle')}
              </Text>
              {/* social buttons */}
              <Block row center justify="space-evenly" marginVertical={sizes.m}>
                <Button outlined gray shadow={!isAndroid}>
                  <Image
                    source={assets.facebook}
                    height={sizes.m}
                    width={sizes.m}
                    color={isDark ? colors.icon : undefined}
                  />
                </Button>
                <Button outlined gray shadow={!isAndroid}>
                  <Image
                    source={assets.apple}
                    height={sizes.m}
                    width={sizes.m}
                    color={isDark ? colors.icon : undefined}
                  />
                </Button>
                <Button outlined gray shadow={!isAndroid}>
                  <Image
                    source={assets.google}
                    height={sizes.m}
                    width={sizes.m}
                    color={isDark ? colors.icon : undefined}
                  />
                </Button>
              </Block>
              <Block
                row
                flex={0}
                align="center"
                justify="center"
                marginBottom={sizes.sm}
                paddingHorizontal={sizes.xxl}>
                <Block
                  flex={0}
                  height={1}
                  width="50%"
                  end={[1, 0]}
                  start={[0, 1]}
                  gradient={gradients.divider}
                />
                <Text center marginHorizontal={sizes.s}>
                  {t('common.or')}
                </Text>
                <Block
                  flex={0}
                  height={1}
                  width="50%"
                  end={[0, 1]}
                  start={[1, 0]}
                  gradient={gradients.divider}
                />
              </Block>
              {/* form inputs */}
              <Block paddingHorizontal={sizes.sm}>

                <Input
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('common.email')}
                  keyboardType="email-address"
                  placeholder={t('common.emailPlaceholder')}
                  success={Boolean(registration.email && isValid.email)}
                  danger={Boolean(registration.email && !isValid.email)}
                  onChangeText={(value) => handleChange({ email: value })}
                />
                <Input
                  secureTextEntry
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('common.password')}
                  placeholder={t('common.passwordPlaceholder')}
                  onChangeText={(value) => handleChange({ password: value })}
                  success={Boolean(registration.password && isValid.password)}
                  danger={Boolean(registration.password && !isValid.password)}
                />
                <Input
                  secureTextEntry
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={"Confirm Password"}
                  placeholder={"Enter a confirm password"}
                  onChangeText={(value) => handleChange({ confirmPassword: value })}
                  success={Boolean(registration.confirmPassword && isValid.confirmPassword)}
                  danger={Boolean(registration.confirmPassword && !isValid.confirmPassword)}
                />
              </Block>
              {/* checkbox terms */}
              <Block row flex={0} align="center" paddingHorizontal={sizes.sm}>
                <Checkbox
                  marginRight={sizes.sm}
                  checked={registration?.agreed}
                  onPress={(value) => handleChange({ agreed: value })}
                />
                <Text paddingRight={sizes.s}>
                  {t('common.agree')}
                  <Text
                    semibold
                    onPress={() => {
                      Linking.openURL('https://www.creative-tim.com/terms');
                    }}>
                    {t('common.terms')}
                  </Text>
                </Text>
              </Block>
              <Button
                onPress={handleSignUp}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                gradient={gradients.primary}
                disabled={Object.values(isValid).includes(false)}>
                <Text bold white transform="uppercase">
                  {t('common.signup')}
                </Text>
              </Button>
              <Button
                primary
                outlined
                shadow={!isAndroid}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                onPress={() => navigation.navigate('Pro')}>
                <Text bold primary transform="uppercase">
                  {t('common.signin')}
                </Text>
              </Button>

            </Block>
           
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default Register;
