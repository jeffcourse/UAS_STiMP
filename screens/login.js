import NativeModules,{ StyleSheet, View, TextInput} from "react-native";
import { Card, Text, Button } from "@rneui/base";
import React, {Component} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

class Login extends Component {
    constructor(props){
       super(props);
       this.state = {
          email: '',
          password: '',
        };
    }

    doLogin = async (email,password) => {
    if (!email || !password) {
        alert('Seluruh input field harus diisi');
    }
    else{
      const options = {
           method: 'POST',
           headers: new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
           }),
           body: "email="+email + "&password="+ password
          };
          
          const response = await fetch(
            'https://ubaya.me/flutter/160420011/uas/login.php',
            options
          );
          const json = await response.json();
        
          if (json.result == 'success') {
            try {
              const userName = json.name;
              const email = json.email;
              await AsyncStorage.setItem('name',userName);
              await AsyncStorage.setItem('email',email);
              alert('Login sukses. Selamat datang, ' + userName);
            } catch (e) {
              alert(e);
            }
          } else {
            alert('Email dan/atau password salah');
          }
    }}
     
    render() {
      return (
       <Card>
        <Card.Title style={styles.title}>DolanYuk</Card.Title>
        <Card.Divider/>
          <View style={styles.viewRow}>
            <Text>Email </Text>
            <TextInput style={styles.input} 
            onChangeText={(email) => this.setState({email})}
            />
          </View>
          <View style={styles.viewRow}>
            <Text>Password </Text>
            <TextInput secureTextEntry={true} style={styles.input} 
            onChangeText={(password) => this.setState({password})}/>
          </View>
          <View style={styles.viewRow}>
            <Button style={styles.button2} title="Sign Up"
                        onPress={() => this.props.navigation.navigate("Signup")}
            />
            <Button style={styles.button} title="Sign In"
                onPress={()=>
                  {this.doLogin(this.state.email,this.state.password)}
                }
              />
          </View>
       </Card>
      );
    }
}

const styles = StyleSheet.create({
    title: {
      fontSize: 24,
    },
     input: {
      height: 40,
      width:300,
      borderWidth: 1,
      padding: 10,
     },
     button: {
      height: 40,
      width:145, 
      marginLeft: 10,
     },
     button2: {
      height: 40,
      width: 145,
     },
     viewRow:{
      flexDirection:"row",
      justifyContent:"flex-end",
      alignItems: 'center',
      paddingRight:50,
      margin:3
     }
   })
    
export default Login;
    