import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Linking, Platform, ToastAndroid, ScrollView, TouchableWithoutFeedback, } from 'react-native';
import { useNavigation } from '@react-navigation/core';


import { useData, useTheme, useTranslation } from '../hooks';
import * as regex from '../constants/regex';
import { Block, Button, Input, Image, Text, Checkbox, Modal } from '../components';
import axios from 'axios';
import { StyleSheet, View, SafeAreaView, SectionList, StatusBar } from 'react-native';
import { ICategory } from '../constants/types';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import { Badge, Card, ListItem } from 'react-native-elements';
import styles from '../components/styles';
import Storage from '@react-native-async-storage/async-storage';


const isAndroid = Platform.OS === 'android';


const Panier = () => {
  const { user } = useData();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { assets, colors, sizes, gradients } = useTheme();
  const [quantity, setQuantity] = useState('Math');
  const [showModal, setModal] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [show, setshow] = useState(false);
  const [section, setSection] = useState()
  const [formData, setFormData] = useState()
  const [formCoiff, setformCoiff] = useState()
  const [input, setInput] = useState()
  const [inputs, setInputs] = useState({});
  const [data, setData] = useState({ section: "", data: [] });
  const [Filiers, setFiliers] = useState([])















  const getMatiere = useCallback(async () => {
    const IdUser = await Storage.getItem('userId');
    const data = []
    const dataCoiff = []
    try {

      let res = await fetch('http://192.168.20.70:5000/panier/panierGetById', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UserId:IdUser

        }),
      }).then((response) => response.json()) //   <------ this line 
        .then(async (response) => {
          console.log("result", response)
          response.data.Filiers.forEach(element  => {
            data.push(element)
            console.log("vvvv", element)
          });
          setFiliers(data)
          console.log("result", data)

         

          return response;
        });;
    } catch (e) {
      console.error(e);
    }

  }, []);





  useEffect(() => {
    getMatiere();

  }, []);




  return (
    <Block color={colors.card}
      paddingTop={sizes.m}
      paddingHorizontal={sizes.padding}>





<Block
        scroll
        paddingHorizontal={sizes.padding}
        showsVerticalScrollIndicator={false}
       contentContainerStyle={{paddingBottom: sizes.l}}
        >
        <Block   marginTop={sizes.sm}>
          {Filiers?.map((item) => (
            // <Product {...item} key={`card-${item?.etablisementId}`} />

            
            <TouchableWithoutFeedback 
             >
            <Block card padding={sizes.sm} marginTop={sizes.sm} >
            
            {/* article category */}
           
            
              <Text
                h5
                bold
                size={13}
                marginTop={sizes.s}
                
                transform="uppercase"
                marginLeft={sizes.xs}
                gradient={gradients.primary}>
                {item.NameFiliers}
              </Text>
             
              <Image
               
               paddingRight={1}
               marginBottom={1}
               marginLeft={260}
               source={assets.close}
               color={colors.primary}
              
             />
             
            
          </Block>
       
          </TouchableWithoutFeedback>

          ))}


        </Block>

        <Block row justify="space-between" marginBottom={70}  >
          <Block row
            align="center"
            justify="space-between"
            paddingHorizontal={sizes.sm}
            marginTop={240}>
          
            <Block>
            
              <Button gradient={gradients.primary} marginHorizontal={sizes.sm}    >
              <Text white bold transform="uppercase" marginHorizontal={sizes.s} marginTop={1} >
                  Send
                </Text>
                </Button>
      </Block>
      </Block>
      </Block>
      </Block>



    </Block>


  );

};
export default Panier;


