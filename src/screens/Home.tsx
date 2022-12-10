import React, {useCallback, useEffect, useState} from 'react';
import {TouchableOpacity,TouchableWithoutFeedback} from 'react-native';
import {useData, useTheme, useTranslation} from '../hooks/';
import {Block, Button, Image, Input, Product, Text} from '../components/';
import { ListItem } from 'react-native-elements';
import { useNavigation } from '@react-navigation/core';

const Home = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [tab, setTab] = useState<number>(0);
  const {following, trending} = useData();
 // const {etatique, setEtatique} = useState();
 // const {p,SetEtablissement}= useState();

  //const [etablisement, SetEtablissement] = useState();
  const [etatique, setEtatique] = useState();
  const [search, setSearch] = useState();
  const [prive, setPrive] = useState();
  const [products, setProducts] = useState();
  const [productsCopie, setProductsCopie] = useState();

  const {assets, colors, fonts, gradients, sizes,icons} = useTheme();
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const handleProducts = useCallback(
    (tab: number) => {
      setTab(tab);
      setProducts(tab === 0 ? etatique : prive);
      setProductsCopie(tab === 0 ? etatique : prive);

    },
    [etatique, prive, setTab, setProducts],
  );
  const handleetablisement = async () => {
var data=""
    try {
   



      const response = await fetch('http://192.168.20.70:5000/etablisement/etablisementGetAll').then((response)=>response.json()

      ) //   <------ this line 
      
      .then(async (response)=>{
        const dataprive=[]
        const dataEtatique=[]
        response.forEach(element  => {
         
          data=element.type
          console.log("zzzz",data)
          if(data=='prive'){
            console.log("dd",data)
           // setPrive(element)
           dataprive.push(element)
           setPrive(dataprive)
            console.log("ttt",element)}
            else {
              dataEtatique.push(element)
              setEtatique(dataEtatique)
             
            }
        });
     console.log("dataprive",dataprive)
     console.log("ggv",dataEtatique)
     setProducts(dataEtatique);

    // SetEtablissement(res)
      console.log("tab",tab)
      });
   
    } catch (error) {
      console.error(error);
    }


  }
  const handleSearch =(value)=>{   
  let data = products
  console.log("hh",productsCopie)

 let searchData = products.filter(item=>item.nameEtablisement.includes(value.value));
 setProducts(searchData)
 console.log(searchData)
 if(value.value.length == 0)
 {
  setProducts(productsCopie)

 }

  }
  const  handlePr = async (item) => {
    navigation.navigate('Profile',{item})
    console.log(item)
  }
 

  useEffect(() => {
    handleetablisement();
  
  },[]);
  return (
    <Block>
      {/* search input */}
      <Block color={colors.card} flex={0} padding={sizes.padding}>
        <Input search placeholder={t('common.search')} 
                onChangeText={(value) => handleSearch({value} )}/>
      </Block>

      {/* toggle products list */}
      <Block
        row
        flex={0}
        align="center"
        justify="center"
        color={colors.card}
        paddingBottom={sizes.sm}>
        <Button onPress={() => handleProducts(0)}>
          <Block row align="center">
            <Block
              flex={0}
              radius={6}
              align="center"
              justify="center"
              marginRight={sizes.s}
              width={sizes.socialIconSize}
              height={sizes.socialIconSize}
              gradient={gradients?.[tab === 0 ? 'primary' : 'secondary']}>
              <Image source={assets.extras} color={colors.white} radius={0} />
            </Block>
            <Text p font={fonts?.[tab === 0 ? 'medium' : 'normal']}>
              Etatique
            </Text>
          </Block>
        </Button>
        <Block
          gray
          flex={0}
          width={1}
          marginHorizontal={sizes.sm}
          height={sizes.socialIconSize}
        />
        <Button onPress={() => handleProducts(1)}>
          <Block row align="center">
            <Block
              flex={0}
              radius={6}
              align="center"
              justify="center"
              marginRight={sizes.s}
              width={sizes.socialIconSize}
              height={sizes.socialIconSize}
              gradient={gradients?.[tab === 1 ? 'primary' : 'secondary']}>
              <Image
                radius={0}
                color={colors.white}
                source={assets.documentation}
              />
            </Block>
            <Text p font={fonts?.[tab === 1 ? 'medium' : 'normal']}>
             Prive
            </Text>
          </Block>
        </Button>
      </Block>

      {/* products list */}
      <Block
        scroll
        paddingHorizontal={sizes.padding}
        showsVerticalScrollIndicator={false}
       contentContainerStyle={{paddingBottom: sizes.l}}
        >
        <Block   marginTop={sizes.sm}>
          {products?.map((item) => (
            // <Product {...item} key={`card-${item?.etablisementId}`} />
            <TouchableWithoutFeedback  onPress={()=> {
              handlePr(item);
              } }>
            <Block card padding={sizes.sm} marginTop={sizes.sm} >
            <Image height={170} resizeMode="cover" source={{uri: item.galorie[0].path}} />
            {/* article category */}
           
              <Text
                h5
                bold
                size={13}
                marginTop={sizes.s}
                transform="uppercase"
                marginLeft={sizes.xs}
                gradient={gradients.primary}>
                {item.nameEtablisement}
              </Text>
  
  
            {/* article description */}
            
              <Text
                p
                marginTop={sizes.s}
                marginLeft={sizes.xs}
                marginBottom={sizes.sm}>
                {item.description}
              </Text>
            
  
            
  
            {/* location & rating */}
            
            
              <Block row align="center">
                <Image source={icons.location} marginRight={sizes.s} />
                <Text p size={12} semibold>
                  {item.ville}, {item.region}
                </Text>
                <Text p bold marginHorizontal={sizes.s}>
                  •
                </Text>
                <Image source={icons.star} marginRight={sizes.s} />
                <Text p size={12} semibold>
                  {item.rating}/5
                </Text>
              </Block>
            
          </Block>
          </TouchableWithoutFeedback>
          ))}
        </Block>
      </Block>
    </Block>
  );
};

export default Home;
