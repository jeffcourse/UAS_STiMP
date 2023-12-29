import { StyleSheet, View, Text,FlatList,Button,ScrollView,TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { Card} from "@rneui/base";
import { FAB } from "react-native-paper";
import { Divider } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native'; 

const Chat = (props) => {
  const route = useRoute();
  const { schedule_id, game_name } = route.params;
  const [data, setData] = useState([]);
  const [noData, setNoData] = useState(false);
  const [textInputValue, setTextInputValue] = useState("");
  const [refreshIndicator, setRefreshIndicator] = useState(0);
     
    const fetchData = async (schedule_id) => {
      const email = await AsyncStorage.getItem('email');
      const options = {
            method: 'POST',
            headers: new Headers({
             'Content-Type': 'application/x-www-form-urlencoded'
            }),
            body: "email="+email+"&schedules_id="+schedule_id
           };
                try {
                  fetch('https://ubaya.me/flutter/160420011/uas/get_chats.php',options)
                    .then(response => response.json())
                    .then(resjson =>{
                      if(resjson.data == "No data"){
                        setNoData(true);
                      }else{
                        setData(resjson.data);
                      }
                    });
                } catch (error) {
                  console.log(error);
                } 
              }

              useEffect(() => {
                fetchData(schedule_id);
              }, [refreshIndicator]);
            
              useEffect(() => {
                const unsubscribe = props.navigation.addListener('focus', () => {
                  setRefreshIndicator(prev => prev + 1);
                });
            
                return unsubscribe;
              }, [props.navigation]);
        
    const showData = (data) =>{
        return <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({item}) => (
                <Card>
                    {item.is_current_user == 1 ? (
                      <Card.Title style={styles.title}>You</Card.Title>
                    ) : (
                      <Card.Title style={styles.title}>{item.name}</Card.Title>
                    )}
                    <Text>{item.chat}</Text>
                </Card>
            )}
            />
    }

    const addComment = async (schedule_id, chat) => {
        if (chat == "") {
            alert('Mohon tulis chat terlebih dahulu');
        }
        else{
         const user_email = await AsyncStorage.getItem('email');
           const options = {
            method: 'POST',
            headers: new Headers({
             'Content-Type': 'application/x-www-form-urlencoded'
            }),
            body: "user_email="+user_email+"&"+
               "schedule_id="+schedule_id+"&"+
               "chat="+chat
           };
            try {
             fetch('https://ubaya.me/flutter/160420011/uas/new_chat.php',
             options)
              .then(response => response.json())
              .then(resjson =>{
               console.log(resjson);
               if(resjson.result=='success'){
                //Sukses tambah komentar
                setTextInputValue("");
                setNoData(false);
                setRefreshIndicator(prev => prev + 1);
               }
              });
            } catch (error) {
             console.log(error);
            }
        }}

    if (noData) {
      return (
        <View style={{ flex: 1 }}>
            <View style={styles.titlePosition}><Text style={styles.name}>{game_name}</Text></View>
            <View style={styles.centeredView}>
                <Text style={{ textAlign: 'center' }}>Belum ada chat</Text>
            </View>
            <Divider></Divider>
            <View style={styles.viewRow}>
                <Text>Tulis Chat </Text>
                <TextInput style={styles.input} 
                onChangeText={(chat) => setTextInputValue(chat)}
                value={textInputValue}
                />
                <FAB
                icon="send"
                style={{ backgroundColor: 'transparent' }}
                onPress={() => {
                    addComment(schedule_id,textInputValue);
                }}
                />
            </View>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <ScrollView style={{ paddingBottom: 80 }}>
            <View style={styles.titlePosition}><Text style={styles.name}>{game_name}</Text></View>
            {showData(data)}
          </ScrollView>
          <Divider></Divider>
          <View style={styles.viewRow}>
                <Text>Tulis Chat </Text>
                <TextInput style={styles.input} 
                onChangeText={(chat) => setTextInputValue(chat)}
                value={textInputValue}
                />
                <FAB
                icon="send"
                style={{ backgroundColor: 'transparent' }}
                onPress={() => {
                    addComment(schedule_id,textInputValue);
                }}
                />
          </View>
        </View>
      );
    }
  };

 const styles = StyleSheet.create({
    name: {
        fontWeight: 'bold',
        fontSize: 24,
    },
    titlePosition: {
        marginLeft: 15,
        marginTop: 15,
    },
  space: {
    marginBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
    title: {
        marginTop: 5,
        textAlign: 'left',
        fontSize: 14,
        marginBottom: 5,
    },
      input: {
       height: 40,
       width:320,
       borderWidth: 1,
       padding: 10,
      },
      viewRow:{
       flexDirection:"row",
       justifyContent:"flex-end",
       alignItems: 'center',
       paddingRight:20,
       margin:3
      },
    })

export default Chat;
