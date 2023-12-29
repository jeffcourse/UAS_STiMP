import React, {Component} from 'react';
import {StyleSheet, View, Text, FlatList, TextInput} from 'react-native';
import ValidationComponent from 'react-native-form-validator';
import { Card, Icon, Button } from "@rneui/base";
import { TimePickerModal } from "react-native-paper-dates";
import { DatePickerModal } from 'react-native-paper-dates';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

export default class BuatJadwal extends ValidationComponent {
  constructor(props){
    super(props);
    this.state = { 
      date:"",
      time:"",
      location:"",
      address:"",
      min_players:0,
      isDatePickerVisible:false,
      isTimePickerVisible:false,
      is_fetched:false,
      games:{},
      dd_items:[],
      dd_value:'',
      dd_open:false,
    }
  }
  _onPressButton = () => {
    if(this.validate({
           location: {required: true},
           address: {required:true},
          }))
          {
           this.submitData();
          }  
  }

  showDatePicker = () => {
    this.setState({ isDatePickerVisible: true });
   };
 
   hideDatePicker = () => {
    this.setState({ isDatePickerVisible: false });
   };

   handleDatePicked = date => {
    const options = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
  
    const formattedDate = date.date.toLocaleDateString('id-ID', options);
  
    this.setState({
      date: formattedDate
    });
  
    this.hideDatePicker();
   };

   showTimePicker = () => {
    this.setState({ isTimePickerVisible: true });
   };
  
   hideTimePicker = () => {
    this.setState({ isTimePickerVisible: false });
   };

   handleTimePicked = (time) => {
    const formattedTime = `${time.hours}:${time.minutes}`;
    this.setState({ time: formattedTime });
    this.hideTimePicker();
   };

   setOpen = open => {
        this.setState({
        dd_open:open
        });
    }

    setValue=callback=> {
        const selectedGame = this.state.dd_items.find((item) => item.id == callback(this.state.dd_value));
        this.setState({
            dd_value: callback(this.state.dd_value),
            min_players: selectedGame ? selectedGame.min_players : null,
        });
    };

    fetchDataDD = () => {
        const options = {
         method: 'POST',
         headers: new Headers({
          'Content-Type': 'application/x-www-form-urlencoded'
         }),
        };
         try {
          fetch('https://ubaya.me/flutter/160420011/uas/get_games.php',
          options)
           .then(response => response.json())
           .then(resjson =>{
            var data=resjson.data;
            this.setState(
             this.state = {
              dd_items:data
             })
           });
         } catch (error) {
          console.log(error);
         }
        }

   submitData = async () => {
    if (this.state.date == "" || this.state.time == "" || this.state.location == "" 
    || this.state.address == "" || this.state.dd_value == "" || this.state.min_players <= 0) {
        alert('Seluruh input field harus diisi dengan benar');
    }
    else{
     const user_email = await AsyncStorage.getItem('email');
       const options = {
        method: 'POST',
        headers: new Headers({
         'Content-Type': 'application/x-www-form-urlencoded'
        }),
        body: "user_email="+user_email+"&"+
           "date="+this.state.date+"&"+
           "time="+this.state.time+"&"+
           "location="+this.state.location+"&"+
           "address="+this.state.address+"&"+
           "game_id="+this.state.dd_value+"&"+
           "min_players="+this.state.min_players
       };
        try {
         fetch('https://ubaya.me/flutter/160420011/uas/new_schedule.php',
         options)
          .then(response => response.json())
          .then(resjson =>{
           console.log(resjson);
           if(resjson.result=='success') alert('Sukses menambah jadwal');
           const { navigation } = this.props;
           this.props.navigation.navigate("Jadwal");
          });
        } catch (error) {
         console.log(error);
        }
    }}

  render() {
    if(this.state.is_fetched == false)
    {
        this.fetchDataDD();
        this.state.is_fetched = true;
        return <Text>Waiting JSON..</Text>
    }else{
        return (
         <View>
          <Card>
          <Card.Title>Buat Jadwal Baru</Card.Title>
          <Card.Divider/>
          <Text>Tanggal Dolan</Text>
            <View style={styles.viewRow}>
            <Text style={styles.input3}>{this.state.date}</Text>
            <Button title="..." onPress={this.showDatePicker} />
            </View>
            <DatePickerModal
            locale="en"
            mode="single"
            visible={this.state.isDatePickerVisible}
            onConfirm={this.handleDatePicked}
            date={this.state.date}
            onCancel={this.hideDatePicker}
            />

            <Text>Jam Dolan</Text>
            <View style={styles.viewRow}>
            <Text style={styles.input3}>{this.state.time}</Text>
            <Button title="..." onPress={this.showTimePicker} />
            </View>
            <TimePickerModal
                locale="en"
                visible={this.state.isTimePickerVisible}
                onConfirm={this.handleTimePicked}
                onCancel={this.hideTimePicker}
            />

          <Text>Lokasi</Text>
          <TextInput style={styles.input} onChangeText={(location) => this.setState({location})} value={this.state.location} />

          <Text>Alamat Dolan</Text>
          <TextInput style={styles.input}
            onChangeText={(address) => this.setState({address})} value={this.state.address} />

      <Text>Dolan Utama</Text>
      <DropDownPicker
       schema={{
        label: 'game_name',
        value: 'id'
       }}
       open={this.state.dd_open}
       value={this.state.dd_value}
       items={this.state.dd_items}
       setOpen={this.setOpen}
       setValue={this.setValue}
      />

      <Text>Minimal Member</Text>
      <TextInput
        style={styles.input}
        onChangeText={(min_players) => this.setState({ min_players })}
        value={this.state.min_players ? String(this.state.min_players) : ''}
        keyboardType="numeric"
        editable={false}
      />

          <Button
          onPress={this._onPressButton}
          title="Buat Jadwal"
          />
    
         <Text>
          {this.getErrorMessages()}
         </Text>
         </Card>
        </View>
        )
      }
    }}

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  input2: {
    height: 100,
    width: '100%',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  input3: {
    height: 40,
    width: '100%',
    borderWidth: 1,
  },
  viewRow:{
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 50,
    marginBottom: 10,
  }
})
