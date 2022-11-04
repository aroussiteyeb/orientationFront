import React from 'react';
import {TouchableOpacity,TouchableWithoutFeedback} from 'react-native';

import Block from './Block';
import Image from './Image';
import Text from './Text';
import {IProduct} from '../constants/types';
import {useTheme, useTranslation} from '../hooks/';

const Product = ({galorie, nameEtablisement, type, description,ville,region,rating}: IProduct) => {
  const {t} = useTranslation();
  const {assets, colors, sizes,gradients,icons} = useTheme();

  const isHorizontal = type !== 'vertical';
  const CARD_WIDTH = (sizes.width - sizes.padding * 2 - sizes.sm) / 2;

  return (
 /*  <Block
      card
      flex={0}
      row={isHorizontal}
      marginBottom={sizes.sm}
      width={isHorizontal ? CARD_WIDTH * 2 + sizes.sm : CARD_WIDTH}>
      <Image
        resizeMode="cover"
        source={{uri: galorie[0].path}}
        style={{
          height: isHorizontal ? 114 : 110,
          width: !isHorizontal ? '100%' : sizes.width / 2.435,
        }}
      />
      <Block
        paddingTop={sizes.s}
        justify="space-between"
        paddingLeft={isHorizontal ? sizes.sm : 0}
        paddingBottom={isHorizontal ? sizes.s : 0}>
        <Text p marginBottom={sizes.s}>
          {nameEtablisement}
        </Text>
        <TouchableOpacity>
          <Block row flex={0} align="center">
            <Text
              p
              color={colors.link}
              semibold
              size={sizes.linkSize}
              marginRight={sizes.s}>
              {linkLabel || t('common.readArticle')}
            </Text>
            <Image source={assets.arrow} color={colors.link} />
          </Block>
        </TouchableOpacity>
      </Block>
    </Block> */
    <TouchableWithoutFeedback >
    <Block card padding={sizes.sm} marginTop={sizes.sm} >
          <Image height={170} resizeMode="cover" source={{uri: galorie[0].path}} />
          {/* article category */}
         
            <Text
              h5
              bold
              size={13}
              marginTop={sizes.s}
              transform="uppercase"
              marginLeft={sizes.xs}
              gradient={gradients.primary}>
              {nameEtablisement}
            </Text>


          {/* article description */}
          
            <Text
              p
              marginTop={sizes.s}
              marginLeft={sizes.xs}
              marginBottom={sizes.sm}>
              {description}
            </Text>
          

          

          {/* location & rating */}
          
          
            <Block row align="center">
              <Image source={icons.location} marginRight={sizes.s} />
              <Text p size={12} semibold>
                {ville}, {region}
              </Text>
              <Text p bold marginHorizontal={sizes.s}>
                •
              </Text>
              <Image source={icons.star} marginRight={sizes.s} />
              <Text p size={12} semibold>
                {rating}/5
              </Text>
            </Block>
          
        </Block>
        </TouchableWithoutFeedback>
        
  );
};

export default Product;
