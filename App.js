import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import React, {Component, useEffect} from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Login from './screens/login';
import Cari from './screens/cari';
import Jadwal from './screens/jadwal';
import Profil from './screens/profil';
import Signup from './screens/signup';
import Chat from './screens/chat';
import BuatJadwal from './screens/buatjadwal';
import Reset from './screens/reset';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createDrawerNavigator, DrawerContentScrollView,DrawerItem,DrawerItemList } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function CustomDrawerContent(props) {
  const { doLogout } = props; 
  return (
   <DrawerContentScrollView {...props}>
    <DrawerItemList {...props} />
    <DrawerItem label={() => <Text>Logout</Text>}
     onPress={() => doLogout()}
    />
   </DrawerContentScrollView>
  );
}

export default class App extends Component {
  state = {
    islogin: false,
  }


  cekLogin = async () => {
    try {
      const value = await AsyncStorage.getItem('name');
      //alert(value);
      global.activeuser=value;
      if(value !== null) {
        return value;
      }
    } catch(e) {
      // error reading value
    }
  }

constructor(props){
  super(props);
  this.cekLogin().then((item)=>{
    if(item!=null){
      this.setState(
        this.state={
          islogin:true
        }
      )
    }
  })
}

doLogout = async () => {
  try {
   await AsyncStorage.removeItem('name');
   alert('Logged Out');
   this.setState(
    this.state={
      islogin:false
    }
   )
  } catch (e) {
  }
}

render(){
  if(!this.state.islogin ){
    return(
      <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="Login" component={Nav2} options={{ headerShown: false }}/>
      </Stack.Navigator>
      </NavigationContainer>);
 }else
  return (
    <NavigationContainer>
      <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} doLogout={this.doLogout}/>}>
        <Drawer.Screen name= "DolanYuk" component={Nav1}
        options={{ headerShown: true }} />
        <Drawer.Screen name="Jadwal" component={NavJadwal} />
        <Drawer.Screen name="Cari" component={NavCari} />
        <Drawer.Screen name="Profil" component={Profil} />
        <Drawer.Screen name="Reset" component={Reset} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
}

function Nav1(){
  return(
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({focused}) => {
          var iconName;
          if(route.name=='Jadwal')
          { iconName='calendar';
            var iconColor=(focused)? 'blue':'gray';}
          if(route.name == 'Cari')
          { iconName='search';
            var iconColor=(focused)? 'blue':'gray';}
          if(route.name == 'Profil')
          { iconName='person';
            var iconColor=(focused)? 'blue':'gray';}
          return <Ionicons name={iconName} size={30} color={iconColor}/>;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Jadwal" component={NavJadwal} options={{ headerShown: false }}/>
      <Tab.Screen name="Cari" component={NavCari} options={{ headerShown: false }}/>
      <Tab.Screen name="Profil" component={Profil} options={{ headerShown: false }}/>
    </Tab.Navigator>
  );
}

function Nav2({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login">
        {(props) => <Login {...props} navigation={navigation} />}
      </Stack.Screen>
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );
}

function NavJadwal() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Jadwal" component={Jadwal} options={{ headerShown: false }}/>
      <Stack.Screen name="Chat" component={Chat} options={{ headerShown: true, title: "Party Chat"}}/>
      <Stack.Screen name="BuatJadwal" component={BuatJadwal} options={{ headerShown: true, title: "Buat Jadwal" }}/>
    </Stack.Navigator>
  );
}

function NavCari() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Cari" component={Cari} options={{ headerShown: false }}/>
      <Stack.Screen name="Chat" component={Chat} options={{ headerShown: true, title: "Party Chat" }}/>
      <Stack.Screen name="BuatJadwal" component={BuatJadwal} options={{ headerShown: true, title: "Buat Jadwal" }}/>
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
