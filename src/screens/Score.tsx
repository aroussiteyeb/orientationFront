import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Linking, Platform, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/core';


import { useData, useTheme, useTranslation } from '../hooks';
import * as regex from '../constants/regex';
import { Block, Button, Input, Image, Text, Checkbox, Modal } from '../components';
import axios from 'axios';
import { StyleSheet, View, SafeAreaView, SectionList, StatusBar } from 'react-native';
import { ICategory } from '../constants/types';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';



const isAndroid = Platform.OS === 'android';


const Score = () => {
  const { user } = useData();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { assets, colors, sizes, gradients } = useTheme();
  const [quantity, setQuantity] = useState('specialite');
  const [showModal, setModal] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [show, setshow] = useState(false);
  const [section, setSection] = useState()


  const handleOpen = () => {
    setshow(true)
  }

  const handleClose = () => {
    setshow(false)
  }
  const handlenavigate = () => {
    setshow(false)
    navigation.navigate('Register')

  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#00000',
      alignItems: 'center',
      justifyContent: 'center'
    }
  })



  const handleSection = async () => {

    try {
      const response = await fetch('http://192.168.10.196:5000/section/sectionGetAll');
      const data =[]
      const json = await response.json();
      json.forEach(element  => {
        data.push(element.nameSection)
      });
      setSection(data);
      console.log("mm", data)
    } catch (error) {
      console.error(error);
    }


  }
   const getMatiere= useCallback(async (nameSection) => {  
      try {
        let res = await fetch('http://192.168.10.196:5000/section/sectionGetByName', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name:nameSection
        
          }),
        }).then((response)=>response.json()) //   <------ this line 
        .then(async (response)=>{
       console.log("tt",response.data.matieres)
          return response ;
        });;      
      } catch (e) {
        console.error(e);
      }
    
    },[]); 


  useEffect(() => {
    handleSection();
  
  },[]);






  return (
    <Block

      color={colors.card}

      paddingTop={sizes.m}
      paddingHorizontal={sizes.padding}>
      <Text p semibold marginBottom={sizes.s}>
        Choose your bac
      </Text>
      <Block color={colors.card} row flex={0} paddingVertical={sizes.padding}>

        <Button

          marginVertical={-10}
          flex={1}
          row
          gradient={gradients.primary}

          onPress={() => setModal(true)}>
          <Block
            row justify="space-between" marginBottom={sizes.s}

            align="center"

            paddingHorizontal={sizes.sm}>
            <Text white bold transform="uppercase" marginRight={sizes.sm}>
              {quantity}
            </Text>
            <Image
              source={assets.arrow}
              color={colors.white}
              transform={[{ rotate: '90deg' }]}
            />
          </Block>
        </Button>
      </Block>
      <Modal visible={showModal} onRequestClose={() => setModal(false)}>
        <FlatList
          keyExtractor={(index) => `${index}`}
          data={section}
          
          //data={['section', '02', '03', '04', '05']}

          renderItem={({ item }) => (
            <Button
              marginBottom={sizes.sm}
              onPress={() => {
                getMatiere(item);
                setQuantity(item);
                setModal(false);
              }}>
              <Text p white semibold transform="uppercase">
                {item}
              </Text>
            </Button>
          )}
        />
      </Modal>
      <Block
        paddingTop={15}>

        <Input placeholder="Programation" marginBottom={45} label='Programation' />

        <Input placeholder="Base de donne" marginBottom={45} label=' Base de donne' />

        <Input placeholder="Tic" marginBottom={45} label=' Tic' />

        <Input placeholder="Math" marginBottom={45} label=' Math' />
        <Block row justify="space-between" marginBottom={70} >
          <Block row
            align="center"
            justify="space-between"
            paddingHorizontal={sizes.sm}>
            <Block >

              <Button gradient={gradients.primary} marginHorizontal={sizes.sm} onPress={handleOpen}>
                <SCLAlert
                  theme='success'
                  show={show}
                  title="Lorem"
                  subtitle="Lorem ipsum dolor"
                >
                  <Button gradient={gradients.primary} marginHorizontal={40} onPress={handlenavigate}
                  >
                    <Text white bold transform="uppercase" marginHorizontal={sizes.s} marginTop={1}>
                      Go to filter
                    </Text>
                  </Button>
                  <SCLAlertButton theme="primary" onPress={handleClose}>Done</SCLAlertButton>

                </SCLAlert>
                <Text white bold transform="uppercase" marginHorizontal={sizes.s} marginTop={1}>
                  calculer
                </Text>


              </Button>

            </Block>

            <Block  >
              <Button gradient={gradients.primary}>
                <Text white bold transform="uppercase" marginHorizontal={sizes.sm}>
                  reset
                </Text>
              </Button>
            </Block>
          </Block>
        </Block>
      </Block>

      { /*buttons*/}


    </Block>


  );

};
export default Score;