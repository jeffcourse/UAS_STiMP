import { StyleSheet, View, Text,FlatList,Button,ScrollView,Modal,TouchableHighlight,Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Card} from "@rneui/base";
import { Divider, FAB } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const Jadwal = (props) => {
  const [data, setData] = useState([]);
  const [noData, setNoData] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [member_count, setMemberCount] = useState(0);
  const [min_players, setMinPlayers] = useState(0);
     
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
                  fetch('https://ubaya.me/flutter/160420011/uas/get_user_schedules.php',options)
                    .then(response => response.json())
                    .then(resjson =>{
                      if(resjson.data == "No data"){
                        setNoData(true);
                      }else{
                        setNoData(false);
                        setData(resjson.data);
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
        
    const showData = (data) =>{
        return <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({item}) => (
                <Card>
                    <Card.Image source={{
                        uri:item.game_url,
                    }}/>
                    <Card.Title style={styles.title}>{item.game_name}</Card.Title>
                    <Text>{item.date}</Text>
                    <Text>{item.time}</Text>
                    <View style={styles.button}>
                        <Button
                            title={`${item.member_count}/${item.min_players} orang`}
                            onPress={() =>{
                              fetchDataMember(item.id.toString());
                              setMemberCount(item.member_count);
                              setMinPlayers(item.min_players);
                            }}
                        />
                    </View>
                    <Text>{item.location}</Text>
                    <Text style={styles.space}>{item.address}</Text>
                    <View style={styles.buttonRow}>
                    {item.creator == 1 ? (
                      <View style={styles.button1}>
                      <Button
                          color="#FF0000"
                          title='Delete'
                          onPress={() =>{
                              deleteSchedule(item.id.toString());
                          }}
                      />
                      </View>
                    ) : (
                      <View></View>
                    )}
                    <View style={styles.button2}>
                        <Button
                            style={styles.button2}
                            title='Party Chat'
                            onPress={() =>{
                                const { navigation } = props;
                                props.navigation.navigate("Chat",{schedule_id: item.id.toString(), game_name: item.game_name})
                            }}
                        />
                    </View>
                    </View>
                </Card>
            )}
            />
    }

    const fetchDataMember = async (schedule_id) => {  
      const email = await AsyncStorage.getItem('email');
      const options = {
            method: 'POST',
            headers: new Headers({
             'Content-Type': 'application/x-www-form-urlencoded'
            }),
            body: "email=" + email + "&schedules_id=" + schedule_id
           };
                try {
                  fetch('https://ubaya.me/flutter/160420011/uas/get_schedule_members.php',options)
                    .then(response => response.json())
                    .then(resjson =>{
                      if(resjson.result == "success"){
                        setSelectedMembers(resjson.data);
                        setModalVisible(true);
                      }else{
                        alert("error");
                      }
                    });
                } catch (error) {
                  console.log(error);
                } 
              }

    const deleteSchedule = (schedule_id) =>{
      const options = {
        method: 'POST',
        headers: new Headers({
         'Content-Type': 'application/x-www-form-urlencoded'
        }),
        body: "schedule_id="+schedule_id
       };
            try {
              fetch('https://ubaya.me/flutter/160420011/uas/delete_schedules.php',options)
                .then(response => response.json())
                .then(resjson =>{
                  if(resjson.result == "success"){
                    alert("Sukses hapus jadwal");
                    fetchData();
                  }else{
                    alert("error");
                  }
                });
            } catch (error) {
              console.log(error);
            } 
    }

    if (noData) {
      return (
        <View style={styles.centeredView}>
          <Text style={{ textAlign: 'center' }}>Jadwal main masih kosong nih, Cari konco main atau bikin jadwal baru aja</Text>
          <FAB
            style={styles.fab}
            icon="plus"
            onPress={() => {
              const { navigation } = props;
              navigation.navigate("BuatJadwal");
            }}
          />
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <ScrollView style={{ paddingBottom: 80 }}>
            {showData(data)}
          </ScrollView>
          <Modal 
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
          >
          <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <Text style={styles.modalText}>Konco Dolanan</Text>
          <Text style={styles.modalText2}>Member bergabung: {`${member_count}/${min_players}`}</Text>
          <FlatList
            data={selectedMembers}
            keyExtractor={(item) => item.users_email}
            renderItem={({ item }) => (
              <Card>
                <View style={styles.viewModalRow}>
                <View style={styles.imageContainer}>
                  <Image source={{uri: item.photo_url}} style={styles.profileImage} />
                </View>
                {item.is_current_user == 1 ? (
                  <Text style={styles.nameText}>{`${item.name} (You)`}</Text>
                ) : (
                  <Text style={styles.nameText}>{item.name}</Text>
                )}
                </View>
              </Card>
            )}
          />
          <Divider style={{marginTop: 10, marginBottom: 10}}></Divider>
          <TouchableHighlight
            style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
          >
          <Text style={styles.textStyle3}>Keren!</Text>
          </TouchableHighlight>
          </View>
          </View>
          </Modal>
          <FAB
            style={styles.fab}
            icon="plus"
            onPress={() => {
              const { navigation } = props;
              navigation.navigate("BuatJadwal");
            }}
          />
        </View>
      );
    }
  };

 const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
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
        fontSize: 20,
        marginBottom: 5,
    },
    button: {
        width: 100, 
    },
    buttonRow: {
      flexDirection:"row",
    },
    button1: {
      width: 100,
      marginRight: 'auto',
    },
    button2: {
        width: 100,
        marginLeft: 'auto',
    },
      input: {
       height: 40,
       width:200,
       borderWidth: 1,
       padding: 10,
      },
      viewRow:{
       flexDirection:"row",
       justifyContent:"flex-end",
       alignItems: 'center',
       paddingRight:50,
       margin:3
      },
      viewModalRow:{
        flexDirection:"row",
        justifyContent:"flex-start",
        paddingRight:50,
        margin:3,
      },
      modalView: {
        backgroundColor: "lightgrey",
        width: 350,
        borderRadius: 10,
        padding: 10,
        shadowColor: "#000",
        elevation: 5
      },
      openButton: {
        backgroundColor: "#F194FF",
        textAlign: "center",
        width: 70,
        height: 20,
        borderRadius: 10,
        marginLeft: 'auto',
        marginRight: 15,
        elevation: 2
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "left"
      },
      textStyle3: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginLeft: 15,
        marginBottom: 15,
        fontSize: 20,
      },
      modalText2: {
        marginLeft: 15,
        marginBottom: 15,
        fontSize: 12,
      },
      imageContainer: {
        alignItems: 'center',
        marginRight: 10,
      },
      profileImage: {
        width: 50,
        height: 50,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: 'black',
      },
      nameText: {
        marginTop: 15,
      },
    })

    export default Jadwal;
