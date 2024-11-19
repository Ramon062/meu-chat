import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatScreen from "../TelaChat";
import HomeInicial from "../TelaHome";
import ChatInicial from "../TelaInicial/ChatInicial";
import { NavigationContainer } from "@react-navigation/native";


const Stack = createNativeStackNavigator();

const Rotas = () => {
  return ( <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="HomeInicial" component={HomeInicial} />
      <Stack.Screen name="ChatInicial" component={ChatInicial} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
    
 
  </NavigationContainer>
    
  );
};

export default Rotas;