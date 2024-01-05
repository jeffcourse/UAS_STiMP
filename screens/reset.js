import { StyleSheet, View, Text,Button, Image, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { Card} from "@rneui/base";
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { Divider } from "react-native-paper";

const Reset = (props) => {
  const [email, setEmail] = useState("");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newPassConfirm, setNewPassConfirm] = useState("");

    const checkPasswordNotSame = (newPass, newPassConfirm) => {
        if (newPass != newPassConfirm) return true
        return false
    }

    const resetPassword = async (oldPass, newPass, newPassConfirm) => {
        if (checkPasswordNotSame(newPass, newPassConfirm)) {
          alert("Password confirmation does not match");
          return;
        }
      
        const email = await AsyncStorage.getItem('email');
        const options = {
          method: 'POST',
          headers: new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
          }),
          body: "email=" + email + "&old_pass=" + oldPass + "&new_pass=" + newPass
        };
      
        try {
          fetch('https://ubaya.me/flutter/160420011/uas/reset.php', options)
            .then(response => response.json())
            .then(resjson => {
              if (resjson.result === "success") {
                alert("Password successfully updated");
                props.navigation.navigate("Profil");
              } else if (resjson.result === "fail_auth") {
                alert("Old password is incorrect");
              } else {
                alert("An error occurred");
              }
            });
        } catch (error) {
          console.log(error);
        }
      };

      return (
        <Card>
        <Card.Title style={styles.title}>Reset Password</Card.Title>
        <Card.Divider/>
        <View style={{marginBottom: 20, marginTop: 10}}>
        <View style={styles.viewRow}>
        <Text>Password Lama </Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setOldPass(text)}
        />
      </View>
      <View style={styles.viewRow}>
        <Text>Password Baru </Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setNewPass(text)}
        />
      </View>
      <View style={styles.viewRow}>
        <Text>Konfirmasi Password Baru </Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setNewPassConfirm(text)}
        />
      </View>
      </View>
      <View style={styles.button}>
            <Button title="Simpan"
                onPress={()=> {
                    resetPassword(oldPass, newPass, newPassConfirm);
                }
                }
              />
      </View>
       </Card>
      );
    };

 const styles = StyleSheet.create({
    title: {
        fontSize: 24,
      },
       input: {
        height: 40,
        width:320,
        borderWidth: 1,
        padding: 10,
       },
       button: {
        width:100, 
        marginLeft: 'auto',
        paddingRight: 8,
       },
       viewRow:{
        flexDirection:"row",
        justifyContent:"flex-end",
        alignItems: 'center',
        paddingRight:3,
        margin: 5,
       },
       imageContainer: {
        alignItems: 'center',
        marginBottom: 10,
      },
      profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: 'black',
      },
    })

    export default Reset;

    