import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, View, StyleSheet, ToastAndroid, Alert } from 'react-native';

import { useData, useTheme } from '../hooks/';
import { IArticle, ICategory } from '../constants/types';
import { Block, Button, Input, Text, Switch, Image, Modal } from '../components';
import * as regex from '../constants/regex';
import { useNavigation } from '@react-navigation/core';
import Dialog from "react-native-dialog";
import { useRoute } from '@react-navigation/native';
import { useIsFocused } from "@react-navigation/native";


interface IFiltrationForm {

  score: string;


}
interface IFiltrationFormValidation {

  score: boolean;

}

const Filter = () => {
  const data = useData();
  const isFocused = useIsFocused();

  const [selected, setSelected] = useState<ICategory>();
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const { colors, gradients, sizes, assets } = useTheme();
  const [isValid, setIsValid] = useState<IFiltrationFormValidation>({
    score: false
  })
  const [switch1, setSwitch1] = useState(true);
  const [switch2, setSwitch2] = useState(false);
  const [switch3, setSwitch3] = useState(false);
  const [showModal, setModal] = useState(false);
  const [domaine, setDomaine] = useState('Select domain');
  const [showModalPlace, setModalPlace] = useState(false);
  const [modalSimple, setModalSimle] = useState(false);
  const [dialogInput, setDialogInput] = useState('');
  const [dialogSwitch, setDialogSwitch] = useState('');
  const route = useRoute();
  const [score, setscore] = useState(route.params.Score);
  const [place, setPlace] = useState('Select place');
  const navigation = useNavigation();
  const showToastWithGravityAndOffset = (message :string ) => {
    ToastAndroid.showWithGravityAndOffset(
     message,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
    
      25,
      50
    );
  };
  //category 
  const CATEGORIES: ICategory[] = [
    { id: 1, name: 'Advanced filtering' },
    { id: 2, name: 'Simple filtering' },

  ];
  const [FiltrationForm, setFiltrationForm] = useState<IFiltrationForm>({

    score: '',

  });

  const handleChange = useCallback(
    (value) => {
      setFiltrationForm((state) => ({ ...state, ...value }));
    },
    [setFiltrationForm],
  );

  const HandleFilter = () => {
    navigation.navigate('Resultat')

  };

  const handleFilterType = (id: any) => {
    if (id == 2) {
      setModalSimle(true)
    }

  }


  const hideDialog = () => {
    
    setModalSimle(false)
    setSelected(data?.categories[0]);

  }

  const handleNavigateSimple = async () => {
    setModalSimle(false)
    try {


      let res = await fetch('http:/192.168.20.70:5000/simpleFiltring/filter', {

        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "score":dialogInput,
          "type":dialogSwitch ,
        }),
        
      }).then((response)=>response.json()) //   <------ this line 
      .then(async (response)=>{
        if (response.error==true){
          showToastWithGravityAndOffset(response.message)
        }else{(response.success==true)
          showToastWithGravityAndOffset(response.message)
          //const jsonValue = JSON.stringify({token: response.accessToken})
         //console.log(response.data)
    let message = response.data
          navigation.navigate('Resultat',{message})
        }
        //return response ;
      });;
    
     
    } catch (e) {
      console.error(e);
    }
   // alert(dialogSwitch)
    //navigation.navigate('Resultat')

  };

  // init articles
  useEffect(() => {
  
    setscore(route.params.Score)
    setArticles(data?.articles);
    setCategories(CATEGORIES);
    setSelected(data?.categories[0]);
  }, [data.articles, data.categories, isFocused]);

  // update articles on category change
  useEffect(() => {
    const category = data?.categories?.find(
      (category) => category?.id === selected?.id,
    );

    const newArticles = data?.articles?.filter(
      (article) => article?.category?.id === category?.id,
    );

    setArticles(newArticles);
  }, [data, selected, setArticles]);

  useEffect(() => {
    setIsValid((state) => ({
      ...state,
      score: regex.score.test(FiltrationForm.score),
    }));
  }, [FiltrationForm, setIsValid]);


  return (
    <Block>
      <Block color={colors.card} row flex={0} paddingVertical={sizes.padding}>
        {/* categories list */}

        <Block
          scroll
          horizontal
          renderToHardwareTextureAndroid
          showsHorizontalScrollIndicator={false}
          contentOffset={{ x: -sizes.padding, y: 0 }}>
          {categories?.map((category) => {
            const isSelected = category?.id === selected?.id;
            return (
              <Button
                radius={sizes.m}
                marginHorizontal={sizes.s}
                key={`category-${category?.id}}`}
                onPress={() => { setSelected(category), handleFilterType(category.id) }}
                gradient={gradients?.[isSelected ? 'primary' : 'light']}>
                <Text
                  p
                  bold={isSelected}
                  white={isSelected}
                  black={!isSelected}
                  transform="capitalize"
                  marginHorizontal={sizes.m}>
                  {category?.name}
                </Text>
              </Button>
            );
          })}
        </Block>
      </Block>

      <Block
        color={colors.card}
        marginTop={sizes.m}
        paddingTop={sizes.m}
        paddingHorizontal={sizes.padding}>

        <Block>
          <Input placeholder='Score' marginBottom={sizes.sm}
            defaultValue={String(score)}
            label='Enter your score here'
            success={Boolean(FiltrationForm.score && isValid.score)}
            danger={Boolean(FiltrationForm.score && !isValid.score)}
            onChangeText={(value) => handleChange({ score: value })}
          />
          <View paddingTop={sizes.m}>

            {Boolean(FiltrationForm.score && !isValid.score) ? <Text color={colors.danger}>* Score must be a number </Text> : null}

          </View>

          {/* ligne */}
          <View style={{ flexDirection: 'row' }}>
            <View style={{ backgroundColor: 'gray', height: 0.5, flex: 2, alignSelf: 'center' }} />
          </View>

          {/* select domaine */}
          <Block
            paddingTop={12}
            color={colors.card}
            paddingVertical={sizes.m}
          >
            <Text p semibold marginBottom={sizes.s}>
              About filiere
            </Text>
            <Block paddingBottom={150}>

              <Block row justify="space-between" marginBottom={sizes.base}>


                <Button
                  align='center'
                  flex={1}
                  row
                  gradient={gradients.dark}
                  onPress={() => setModal(true)}>
                  <Block
                    row
                    align="center"
                    justify="space-between"
                    paddingHorizontal={sizes.sm}>
                    <Text white bold transform="uppercase" marginRight={1}>
                      {domaine}
                    </Text>
                    <Image
                      source={assets.arrow}
                      color={colors.white}
                      transform={[{ rotate: '90deg' }]}
                    />
                  </Block>
                </Button>

                <Button
                  marginLeft={3}
                  align='center'
                  flex={1}
                  row
                  gradient={gradients.dark}
                  onPress={() => setModalPlace(true)}>
                  <Block
                    row
                    align="center"
                    justify="space-between"
                    paddingHorizontal={sizes.sm}>
                    <Text white bold transform="uppercase" marginRight={sizes.sm}>
                      {place}
                    </Text>
                    <Image
                      source={assets.arrow}
                      color={colors.white}
                      transform={[{ rotate: '90deg' }]}
                    />
                  </Block>
                </Button>
              </Block>
              {/* ligne */}
              <View style={{ flexDirection: 'row' }}>
                <View style={{ backgroundColor: 'gray', height: 0.5, flex: 2, alignSelf: 'center' }} />
              </View>

              <Block
                color={colors.card}
                paddingVertical={sizes.m}
                paddingTop={15}
              >
                <Text p semibold marginBottom={sizes.s}>
                  Choose the type of university
                </Text>
                <Block>
                  <Block row flex={0} align="center" justify="space-between">
                    <Text>All {switch1 ? 'ON' : 'OFF'}</Text>
                    <Switch
                      checked={switch1}
                      onPress={(checked) => setSwitch1(checked)}
                    />
                  </Block>
                  <Block
                    row
                    flex={0}
                    align="center"
                    justify="space-between"
                    marginTop={sizes.s}>
                    <Text>Itatic {switch2 ? 'ON' : 'OFF'}</Text>
                    <Switch
                      checked={switch2}
                      onPress={(checked) => setSwitch2(checked)}
                    />
                  </Block>
                  <Block
                    row
                    flex={0}
                    align="center"
                    justify="space-between"
                    marginTop={sizes.s}>
                    <Text>Private {switch3 ? 'ON' : 'OFF'}</Text>
                    <Switch
                      checked={switch3}
                      onPress={(checked) => setSwitch3(checked)}
                    />

                  </Block>
                  {/* ligne */}
                  <View style={{ flexDirection: 'row', paddingTop: '3%' }}>
                    <View style={{ backgroundColor: 'gray', height: 0.5, flex: 2, alignSelf: 'center' }} />
                  </View>
                  <Block paddingTop={50}>

                    <Button flex={1} gradient={gradients.primary} marginBottom={sizes.base}
                      onPress={() => HandleFilter()}>
                      <Text white bold transform="uppercase">
                        Filter
                      </Text>
                    </Button>
                  </Block>
                  {/* filtriing simple modal  */}
                  <View style={styles.container}>
                    <Dialog.Container visible={modalSimple}>
                      <Dialog.Title>Simple Filtring</Dialog.Title>
                      <Dialog.Description>
                        This method of filter will make you have a multiple result maybe not recommended for you .
                      </Dialog.Description>
                      <Dialog.Title>university</Dialog.Title>
                      <Dialog.Input onChangeText={(e) => setDialogInput(e)} label='Enter your score'></Dialog.Input>
                      <Dialog.Switch onChange={(e) => setDialogSwitch('math')} label='Mathématiques'></Dialog.Switch>
                      <Dialog.Switch onChange={(e) => setDialogSwitch('se')} label='Sciences expérimentales '></Dialog.Switch>
                      <Dialog.Switch onChange={(e) => setDialogSwitch('eg') }label='Économie et gestion'></Dialog.Switch>
                      <Dialog.Switch onChange={(e) => setDialogSwitch('st')}label='Sciences techniques'></Dialog.Switch>
                      <Dialog.Switch onChange={(e) => setDialogSwitch('lettre')} label='Lettres'></Dialog.Switch>
                      <Dialog.Switch onChange={(e) => setDialogSwitch('sport')}label='Sport'></Dialog.Switch>
                      <Dialog.Switch onChange={(e) => setDialogSwitch('si')} label='Sciences de informatique'></Dialog.Switch>


                      <Dialog.Button label="Cancel" onPress={hideDialog} />
                      <Dialog.Button label="Filter" onPress={handleNavigateSimple} />
                    </Dialog.Container>
                  </View>
                </Block>
              </Block>

            </Block>

          </Block>




        </Block>
        <Modal visible={showModal} onRequestClose={() => setModal(false)}>
          <FlatList
            keyExtractor={(index) => `${index}`}
            data={['Info', 'developemnet', 'robotic']}
            renderItem={({ item }) => (
              <Button
                marginBottom={sizes.sm}
                onPress={() => {
                  setDomaine(item);
                  setModal(false);
                }}>
                <Text p white semibold transform="uppercase">
                  {item}
                </Text>
              </Button>
            )}
          />
        </Modal>

        <Modal visible={showModalPlace} onRequestClose={() => setModalPlace(false)}>
          <FlatList
            keyExtractor={(index) => `${index}`}
            data={['Tunis', 'gabes', 'Zaris']}
            renderItem={({ item }) => (
              <Button
                marginBottom={sizes.sm}
                onPress={() => {
                  setPlace(item);
                  setModalPlace(false);
                }}>
                <Text p white semibold transform="uppercase">
                  {item}
                </Text>
              </Button>
            )}
          />
        </Modal>
        {/*  <View  style={styles.centeredView}>
      <Modal visible={modalSimple} onRequestClose={() => setModalSimle(false)} >
      
      <Input
                 secureTextEntry
                 autoCapitalize="none"
                 marginBottom={6}
                 label='score'
                 placeholder='score'
                 onChangeText={(value) => handleChange({ password: value })}
                 
               />
      
      
     </Modal>
      </View> */}


      </Block>

    </Block>

  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Filter;
