import React, {useCallback, useEffect, useState} from 'react';

import {useData, useTheme, useTranslation} from '../hooks/';
import {Block, Button, Image, Input, Product, Text} from '../components/';
import { ListItem } from 'react-native-elements';

const Home = () => {
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

  const {assets, colors, fonts, gradients, sizes} = useTheme();
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
   

      const response = await fetch('http://192.168.10.86:5000/etablisement/etablisementGetAll').then((response)=>response.json()
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
            <Product {...item} key={`card-${item?.etablisementId}`} />
          ))}
        </Block>
      </Block>
    </Block>
  );
};

export default Home;
