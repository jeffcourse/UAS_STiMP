import NativeModules,{ StyleSheet, View, TextInput} from "react-native";
import { Card, Text, Button } from "@rneui/base";
import React, {Component} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

class Signup extends Component {
    constructor(props){
       super(props);
       this.state = {
          email: '',
          name: '',
          password: '',
          repeatPwd: '',
        };
    }

    doSignUp = async (email,name,password,repeatPwd) => {
    if (!email || !name || !password || !repeatPwd) {
        alert('Seluruh input field harus diisi');
    }
    else if(password == repeatPwd){
        const options = {
            method: 'POST',
            headers: new Headers({
             'Content-Type': 'application/x-www-form-urlencoded'
            }),
            body: "email="+email + "&name="+ name + "&password="+ password
           };
           
           const response = await fetch(
             'https://ubaya.me/flutter/160420011/uas/signup.php',
             options
           );
           const json = await response.json();
         
           if (json.result == 'success') {
             try {
               alert('Sign Up sukses');
               this.props.navigation.navigate("Login")
             } catch (e) {
               alert(e);
             }
           } else {
             alert(json.message);
           }
    }else{
        alert('Perulangan password tidak sesuai');
    }}
     
    render() {
      return (
       <Card>
        <Card.Title style={styles.title}>Sign Up</Card.Title>
        <Text style={styles.text}>Sebelum nikmatin fasilitas DolanYuk, bikin akun dulu yuk!</Text>
        <Card.Divider/>
          <View style={styles.viewRow}>
            <Text>Email </Text>
            <TextInput style={styles.input} 
            onChangeText={(email) => this.setState({email})}
            />
          </View>
          <View style={styles.viewRow}>
            <Text>Nama Lengkap </Text>
            <TextInput style={styles.input} 
            onChangeText={(name) => this.setState({name})}
            />
          </View>
          <View style={styles.viewRow}>
            <Text>Password </Text>
            <TextInput secureTextEntry={true} style={styles.input} 
            onChangeText={(password) => this.setState({password})}/>
          </View>
          <View style={styles.viewRow}>
            <Text>Ulangi Password </Text>
            <TextInput secureTextEntry={true} style={styles.input} 
            onChangeText={(repeatPwd) => this.setState({repeatPwd})}/>
          </View>
          <View style={styles.viewRow}>
            <Button style={styles.button2} title="Kembali"
                        onPress={() => this.props.navigation.navigate("Login")}
            />
            <Button style={styles.button} title="Sign Up"
                onPress={()=>
                  {this.doSignUp(this.state.email,this.state.name,this.state.password,this.state.repeatPwd)}
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
    text: {
        fontSize: 16,
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
      paddingRight:20,
      margin:3
     }
   })
    
export default Signup;
    