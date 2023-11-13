import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import CreateUserScreen from "./screens/CreateUserScreen";

const Stack=createNativeStackNavigator();

function MyStack(){
  return(
        <Stack.Navigator>
          <Stack.Screen name="CreateUserScreen" component={CreateUserScreen}/>
          
        </Stack.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer >
      <MyStack></MyStack>
    </NavigationContainer>
  );
}


