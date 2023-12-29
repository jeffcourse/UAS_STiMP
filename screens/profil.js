import { StyleSheet, View, Text,Button, Image, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { Card} from "@rneui/base";
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { Divider } from "react-native-paper";

const Profil = (props) => {
  const [name, setName] = useState("");
  const [user_email, setUserEmail] = useState("");
  const [photo_url, setPhotoUrl] = useState("");
     
    const fetchData = async () => {  
      const email = await AsyncStorage.getItem('email');
      const options = {
            method: 'POST',
            headers: new Headers({
             'Content-Type': 'application/x-www-form-urlencoded'
            }),
            body: "email="+email
           };
                try {
                  fetch('https://ubaya.me/flutter/160420011/uas/get_user.php',options)
                    .then(response => response.json())
                    .then(resjson =>{
                      if(resjson.result == "success"){
                        const userData = resjson.data[0];
                        setName(userData.name);
                        setUserEmail(userData.email);
                        setPhotoUrl(userData.photo_url);
                      }else{
                        alert("error");
                      }
                    });
                } catch (error) {
                  console.log(error);
                } 
              }

              useEffect(() => {
                fetchData();
              }, []);
            
              useEffect(() => {
                const unsubscribe = props.navigation.addListener('focus', () => {
                  fetchData();
                });
            
                return unsubscribe;
              }, [props.navigation]);

    const updateProfile = async (name,photo_url) => {
      if(photo_url == ""){
        photo_url = 'https://static.thenounproject.com/png/4851855-200.png';
      }    
      const email = await AsyncStorage.getItem('email');
      const options = {
            method: 'POST',
            headers: new Headers({
             'Content-Type': 'application/x-www-form-urlencoded'
            }),
            body: "name="+name+"&photo_url="+photo_url+"&email="+email
           };
                try {
                  fetch('https://ubaya.me/flutter/160420011/uas/update_profile.php',options)
                    .then(response => response.json())
                    .then(resjson =>{
                      if(resjson.result == "success"){
                        alert("Sukses update profil");
                        fetchData();
                      }else{
                        alert("error");
                      }
                    });
                } catch (error) {
                  console.log(error);
                } 
              }

      return (
        <Card>
        <Card.Title style={styles.title}>Update Profil</Card.Title>
        <Card.Divider/>
        <View style={styles.imageContainer}>
            <Image source={{uri: photo_url}} style={styles.profileImage} />
        </View>
        <View style={{marginBottom: 20, marginTop: 10}}>
        <View style={styles.viewRow}>
        <Text>Nama Lengkap </Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={(text) => setName(text)}
        />
      </View>
      <View style={styles.viewRow}>
        <Text>Email </Text>
        <TextInput
          style={styles.input}
          editable={false}
          value={user_email}
        />
      </View>
      <View style={styles.viewRow}>
        <Text>Photo URL </Text>
        <TextInput
          style={styles.input}
          value={photo_url == 'https://static.thenounproject.com/png/4851855-200.png' ? "" : photo_url}
          onChangeText={(text) => setPhotoUrl(text)}
        />
      </View>
      </View>
      <View style={styles.button}>
            <Button title="Simpan"
                onPress={()=>
                  {updateProfile(name,photo_url)}
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

    export default Profil;

    