import { StyleSheet, View, Text,FlatList,TextInput,Button,ScrollView,Modal,TouchableHighlight,Image } from "react-native";
import React from "react";
import { Card} from "@rneui/base";
import { Divider,FAB } from "react-native-paper";
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

class Cari extends React.Component {
    constructor(){
     super();
     this.state = { 
          cari:"",
          data:[],
          modalVisible:false,
          selectedMembers:[],
          member_count:0,
          min_players:0,
        }
     this.fetchData();
    }

    fetchData = async () => {
        const email = await AsyncStorage.getItem('email');
        const options = {
              method: 'POST',
              headers: new Headers({
               'Content-Type': 'application/x-www-form-urlencoded'
              }),
              body: "email="+email+"&search="+this.state.cari,
             };
                  try {
                    fetch('https://ubaya.me/flutter/160420011/uas/get_schedules.php',options)
                      .then(response => response.json())
                      .then(resjson =>{
                          this.setState(
                            this.state = {
                              data:resjson.data
                            });
                        }
                    )
                  } catch (error) {
                    console.log(error);
                  } 
                }

    showData(data){
        return <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({item}) => (
                  <Card>
                    <Card.Image
                      source={{
                        uri: 'https://awildgeographer.files.wordpress.com/2015/02/john_muir_glacier.jpg',
                      }}
                    />
                    <Card.Title style={styles.title}>{item.game_name}</Card.Title>
                    <Text>{item.date}</Text>
                    <Text>{item.time}</Text>
                    <View style={styles.button}>
                      <Button
                        title={`${item.member_count}/${item.min_players} orang`}
                        onPress={() => {
                          this.fetchDataMember(item.id.toString());
                          this.setState(
                            this.state = {
                              member_count:item.member_count,
                              min_players:item.min_players,
                            });
                        }}
                      />
                    </View>
                    <Text>{item.location}</Text>
                    <Text style={styles.space}>{item.address}</Text>
                    {item.is_current_user == 1 ? (
                      <View style={styles.button2}>
                        <Button
                          title='Party Chat'
                          onPress={() => {
                            const { navigation } = this.props;
                            this.props.navigation.navigate("Chat",{schedule_id: item.id.toString(), game_name: item.game_name})
                          }}
                        />
                      </View>
                    ) : (
                      <View style={styles.button2}>
                        <Button
                          title='Join'
                          onPress={() => {
                            this.joinSchedule(item.id.toString(),item.member_count,item.min_players)
                          }}
                        />
                      </View>
                    )}
                  </Card>
                )
            }
        />
    }

    joinSchedule = async (schedule_id,member_count,min_players) => {
      if(member_count < min_players){
        const user_email = await AsyncStorage.getItem('email');
        const options = {
          method: 'POST',
          headers: new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
          body: `user_email=${user_email}&schedule_id=${schedule_id}`,
        };
    
        try{
          const response = await fetch('https://ubaya.me/flutter/160420011/uas/new_member.php', options);
          const result = await response.json();

          if(result.result == 'success'){
            alert('Sukses bergabung');
          }else if(result.result == 'error_duplicate'){
            console.log('Duplicate entry error');
          }else{
            console.log('Error:', result.message);
          }
        }catch (error){
          console.error('Error joining:', error);
        }
      }else{
        alert('Jumlah member sudah memenuhi jumlah pemain maksimum');
      }
    };

    fetchDataMember = async (schedule_id) => {  
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
                        this.setState(
                          this.state = {
                            selectedMembers:resjson.data,
                            modalVisible:true,
                          });
                      }else{
                        alert("error");
                      }
                    });
                } catch (error) {
                  console.log(error);
                } 
              }

    render() {
        return <View style={{ flex: 1 }}><ScrollView style={{ paddingBottom: 80}}>
          <Card>
            <View style={styles.viewRow} >
              <Text>Cari </Text>
              <TextInput style={styles.input} 
              onChangeText={(cari) => this.setState({cari})}
              onSubmitEditing={this.fetchData()} />
            </View>
          </Card>
          {this.showData(this.state.data)}
        </ScrollView>
        <Modal 
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState(
              this.state = {
                modalVisible:false,
              });
          }}
          >
          <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <Text style={styles.modalText}>Konco Dolanan</Text>
          <Text style={styles.modalText2}>Member bergabung: {`${this.state.member_count}/${this.state.min_players}`}</Text>
          <FlatList
            data={this.state.selectedMembers}
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
              this.setState(
                this.state = {
                  modalVisible:false,
                });
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
              const { navigation } = this.props;
              this.props.navigation.navigate("BuatJadwal");
            }}
          />
        </View>
    }
  }

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
  
    export default function(props) {
      const navigation = useNavigation();
      return <Cari {...props} navigation={navigation} />;
    }
