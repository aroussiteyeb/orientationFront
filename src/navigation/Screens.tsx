import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Articles, Components, Home, Profile, Register, Pro, Filter,Resultat,ChatScreen,Chats,AddChatScreen} from '../screens';
import {useScreenOptions, useTranslation} from '../hooks';

const Stack = createStackNavigator();

export default () => {
  const {t} = useTranslation();
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions.stack}>
      <Stack.Screen name="Pro" component={Pro}         options={{headerShown: false}}
 />

         <Stack.Screen
        name="Register"
        component={Register}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{title: t('navigation.home')}}
      />

      <Stack.Screen
        name="Components"
        component={Components}
        options={screenOptions.components}
      />
<Stack.Screen
        name="Resultat"
        component={Resultat}
      />
      <Stack.Screen
        name="Articles"
        component={Articles}
        options={{title: t('navigation.articles')}}
      />


      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false}}
      />
     <Stack.Screen
        name="Filter"
        component={Filter}
        options={{title: 'Filter'}}
      />
        <Stack.Screen name="Chats" component={Chats}   options={screenOptions.chats}  />
        <Stack.Screen name="AddChat" component={AddChatScreen}  options={screenOptions.back} />
        <Stack.Screen name="Chat" component={ChatScreen}   />
    </Stack.Navigator>
  );
};
