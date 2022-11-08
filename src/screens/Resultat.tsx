import React, { useCallback, useEffect, useState, useRef, forwardRef, } from 'react';
import { FlatList, TouchableWithoutFeedback, TouchableOpacity, View, StyleSheet, TextInput } from 'react-native';
import { useRoute } from '@react-navigation/native';

import { useData, useTheme } from '../hooks/';
import { IArticle, ICategory } from '../constants/types';
import { Block, Button, Article, Image, Etablissement, Text } from '../components/';
import { Modalize } from 'react-native-modalize';
import { useCombinedRefs } from '../util/use-combined-refs';

const Rsultat = forwardRef((_, ref) => {
  const data = useData();
  const [selected, setSelected] = useState<ICategory>();
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const { colors, gradients, icons, sizes, assets, fonts } = useTheme();
  const [tab, setTab] = useState<number>(0);
  const { following, trending } = useData();
  const [products, setProducts] = useState(following);
  const route = useRoute();
  const [dataFilter, setData] = useState(route.params.message);
  const [etabli, setEtablissements] = useState([]);
  const modalizeRef = useRef<Modalize>(null);
  const [itemData, setItemdata] = useState([]);

  const onOpen = (etablisementId) => {
    const data = { etablissment: {}, filieres: {}, parcours: {}  };
    //console.log(dataFilter)
    dataFilter.forEach(element => {
      element.etablissment.forEach(result => {
        // console.log(result)
        if (result.etablisementId == etablisementId) {
          //data.push(element)
          data.etablissment = element.etablissment[0]
          data.filieres = element.fileires
          data.parcours = element.parcours
        }
      })

    });
    setItemdata(data)
    modalizeRef.current?.open();
  };
  const combinedRef = useCombinedRefs(ref, modalizeRef);
  const [toggle, setToggle] = useState(true);

  const handleClose = () => {
    if (combinedRef.current) {
      combinedRef.current.close();
    }
  };



  const etablissements = [];
  // init articles
  useEffect(() => {

    setArticles(data?.articles);
    setCategories(data?.categories);
    setSelected(data?.categories[0]);


    dataFilter.forEach(element => {

      element.etablissment.forEach(result => {
        element.fileires.forEach(filiere => {
          //console.log(filiere[0].namefiliere)
          result.nameFiliere = filiere[0].namefiliere;
          etablissements.push(result)

        });

      });
      setEtablissements(etablissements)
    });
  }, [data.articles, data.categories]);

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

  const handleProducts = useCallback(

    (tab: number) => {
      if(tab === 1)
      {let etablissement = []
        dataFilter.forEach(element => {

          element.etablissment.forEach(result => {
            element.fileires.forEach(filiere => {
              //console.log(filiere[0].namefiliere)
              result.nameFiliere = filiere[0].namefiliere;
              etablissement.push(result)
    
            });
    
          });
          setEtablissements(etablissement.sort((a,b)=> Number(a.rating) > Number(b.rating) ? -1 : 1))
        });
        //const data = etabli.sort((a, b) => Number(a.rating) > Number(b.rating) ? 1 : -1);
        console.log(dataFilter)
        //setEtablissements(data)
      }else{
        let etablissement = []
        dataFilter.forEach(element => {

          element.etablissment.forEach(result => {
            element.fileires.forEach(filiere => {
              //console.log(filiere[0].namefiliere)
              result.nameFiliere = filiere[0].namefiliere;
              etablissement.push(result)
    
            });
    
          });
          setEtablissements(etablissement)
        });
      }
 
      setTab(tab);
      setProducts(tab === 0 ? following : trending);
    },
    [following, trending, setTab, setProducts],
  );

  const renderHeader = () => (
    <TouchableOpacity
      style={s.modal__header}
      activeOpacity={0.75}
      onPress={handleClose}
      hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
    >
      <Image
        source={require('../assets/images/cross.png')}
        style={{ tintColor: '#fff', width: '40%', height: '40%' }}
      />
    </TouchableOpacity>
  );

  const renderContent = () => (
    <Etablissement {...itemData} />
  );

  return (

    <Block>
      <>

        <Modalize ref={combinedRef} HeaderComponent={renderHeader} withHandle={false}>
          {renderContent()}
        </Modalize>
      </>
      {/* categories list */}

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
              All result
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
                source={assets.star}
              />
            </Block>
            <Text p font={fonts?.[tab === 1 ? 'medium' : 'normal']}>
              Top 10
            </Text>
          </Block>
        </Button>
      </Block>
      <FlatList
        data={etabli}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => `${item?.etablisementId}`}
        style={{ paddingHorizontal: sizes.padding }}
        contentContainerStyle={{ paddingBottom: sizes.l }}
        renderItem={({ item, index }) => <TouchableWithoutFeedback >

          <Block card white padding={0} marginTop={sizes.sm}>
            {console.log(index, 'test', item.galorie[0].path)}
            <Image
              background
              resizeMode="cover"
              radius={sizes.cardRadius}
              source={{ uri: item.galorie[0].path }}>
              <Block color={colors.overlay} padding={sizes.padding}>
                <Block paddingLeft={'80%'}>
                  <Button onPress={(e) => onOpen(item?.etablisementId)}>
                    <Text p primary semibold>
                      Show more
                    </Text>
                  </Button>
                </Block>
                <Text h4 white marginBottom={sizes.sm}>
                  {item.nameFiliere}
                </Text>
                <Text p white>
                  {item.description}
                </Text>
                {/* user details */}
                <Block row marginTop={sizes.xxl}>
                  <Image
                    radius={sizes.s}
                    width={sizes.xl}
                    height={sizes.xl}
                    source={{ uri: item.avatar }}
                    style={{ backgroundColor: colors.white }}
                  />
                  <Block justify="center" marginLeft={sizes.s}>
                    <Text p white semibold>
                      {item.nameEtablisement}
                    </Text>
                    <Text p white>

                    </Text>
                  </Block>
                  <Block row align="center">
                    <Image source={icons.location} marginRight={sizes.s} />
                    <Text p size={12} white>
                      {item.region}, {item.ville}
                    </Text>
                    <Text p bold marginHorizontal={sizes.s}>
                      •
                    </Text>
                    <Image source={icons.star} marginRight={sizes.s} />
                    <Text p size={12} white>
                      {item.rating}/5
                    </Text>
                  </Block>
                </Block>
              </Block>
            </Image>
          </Block>

        </TouchableWithoutFeedback>}
      />

    </Block>
  );

});
const s = StyleSheet.create({
  modal__header: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 9000,

    alignItems: 'center',
    justifyContent: 'center',

    width: 25,
    height: 25,

    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 4,
  },

  content: {
    padding: 15,
  },

  content__heading: {
    marginBottom: 2,

    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },

  content__subheading: {
    marginBottom: 20,

    fontSize: 16,
    color: '#ccc',
  },

  content__paragraph: {
    fontSize: 15,
    fontWeight: '200',
    lineHeight: 22,
    color: '#666',
  },
});
export default Rsultat;
