import React, {useCallback, useEffect, useState} from 'react';

import {useData, useTheme, useTranslation} from '../hooks/';
import {Block, Button, Image, Input, Product, Text} from '../components/';

const Home = () => {
  const {t} = useTranslation();
  const [tab, setTab] = useState<number>(0);
  const {following, trending} = useData();
 // const {etatique, setEtatique} = useState();
 // const {p,SetEtablissement}= useState();

  const [etablisement, SetEtablissement] = useState();
  const [products, setProducts] = useState(following);
  const {assets, colors, fonts, gradients, sizes} = useTheme();

  const handleProducts = useCallback(
    (tab: number) => {
      setTab(tab);
      setProducts(tab === 0 ? following : trending);
    },
    [following, trending, setTab, setProducts],
  );
  const handleetablisement = async () => {

    try {
   

      const response = await fetch('http://192.168.10.181:5000/etablisement/etablisementGetAll').then((response)=>response.json()
      ) //   <------ this line 
      
      .then(async (response)=>{
        
   
     let res=response
      
     
     SetEtablissement(res)
         
    console.log("ichrak",res)
      })
   
    } catch (error) {
      console.error(error);
    }


  }
  useEffect(() => {

    handleetablisement();
  
  },[]);
  return (
    <Block>
      {/* search input */}
      <Block color={colors.card} flex={0} padding={sizes.padding}>
        <Input search placeholder={t('common.search')} />
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
          {etablisement?.map((item) => (
            <Product {...item} key={`card-${item?.id}`} />
          ))}
        </Block>
      </Block>
    </Block>
  );
};

export default Home;
