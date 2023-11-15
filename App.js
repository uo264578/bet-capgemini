// App.js
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import CreateUserScreen from "./screens/CreateUserScreen";
import Home from './screens/Home';
import Futbol from './screens/Futbol';
import Baloncesto from './screens/Baloncesto';
import Tenis from './screens/Tenis';
import CarrerasCaballos from './screens/CarrerasCaballos';
import { createStackNavigator } from '@react-navigation/stack';
import { app } from './database/firebase';
import LoginScreen from "./screens/LoginScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="CreateUser" component={CreateUserScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Futbol" component={Futbol} />
        <Stack.Screen name="Baloncesto" component={Baloncesto} />
        <Stack.Screen name="Tenis" component={Tenis} />
        <Stack.Screen name="CarrerasCaballos" component={CarrerasCaballos} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
