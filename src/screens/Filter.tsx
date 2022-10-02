import React, {useEffect, useState,useCallback} from 'react';
import {FlatList} from 'react-native';

import {useData, useTheme} from '../hooks/';
import {IArticle, ICategory} from '../constants/types';
import {Block, Button, Input, Text} from '../components/';
import * as regex from '../constants/regex';


interface IFiltrationForm {

  score: string;
  

}
interface IFiltrationFormValidation {

  score: boolean;
 
}

const Filter = () => {
  const data = useData();
  const [selected, setSelected] = useState<ICategory>();
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const {colors, gradients, sizes,assets} = useTheme();
  const [isValid, setIsValid] = useState<IFiltrationFormValidation>({
    score :false
})

  //category 
  const CATEGORIES: ICategory[] = [
    {id: 1, name: 'Advanced filtering'},
    {id: 2, name: 'Simple filtering'},
 
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

  // init articles
  useEffect(() => {
    setArticles(data?.articles);
    setCategories(CATEGORIES);
    setSelected(data?.categories[0]);
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

  useEffect(() => {
    setIsValid((state) => ({
      ...state,
      score: regex.score.test(FiltrationForm.score),
    }));
  }, [FiltrationForm, setIsValid]);


  return (
    <Block>
      {/* categories list */}
      <Block color={colors.card} row flex={0} paddingVertical={sizes.padding}>
        <Block
          scroll
          horizontal
          renderToHardwareTextureAndroid
          showsHorizontalScrollIndicator={false}
          contentOffset={{x: -sizes.padding, y: 0}}>
          {categories?.map((category) => {
            const isSelected = category?.id === selected?.id;
            return (
              <Button
                radius={sizes.m}
                marginHorizontal={sizes.s}
                key={`category-${category?.id}}`}
                onPress={() => setSelected(category)}
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
      <Text p semibold marginBottom={sizes.s}>
        Enter your score here
      </Text>
      <Block>
       
        <Input  placeholder="Score" marginBottom={sizes.sm} 
              success={Boolean(FiltrationForm.score && isValid.score)}
              danger={Boolean(FiltrationForm.score && !isValid.score)}
              onChangeText={(value) => handleChange({score: value})}
        />
       
      </Block>
    </Block>
    
    </Block>
  );
};

export default Filter;
