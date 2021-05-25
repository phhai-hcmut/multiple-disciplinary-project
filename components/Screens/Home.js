import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import auth from '@react-native-firebase/auth';

import {AppStateContext} from '../../App';
import {AirMonitor,  MqttClient, SoilMonitor, LightMonitor,} from '../mqtt';
export default function Home({ navigation }) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const [text1,setText1] = useState('Off');
  const [text2,setText2] = useState('Off');
  const [text3,setText3] = useState('Off');
  const [borderColor1,setColor1] = useState('#999');
  const [borderColor2,setColor2] = useState('#999');
  const [borderColor3,setColor3] = useState('#999');

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  const MqttObj = useContext(AppStateContext);
  const client = MqttObj.client;
  const soilmonitor = MqttObj.soilmonitor;
  const airmonitor = MqttObj.airmonitor;
  const lightmonitor = MqttObj.lightmonitor;

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    ///////////////////////////////////////////////////

    setInterval(() => {
        if (client.client.connected) {
          soilmonitor.checkCondition();
          setText1(soilmonitor.soilIrrigation ? 'On' : 'Off');
          setColor1(soilmonitor.soilIrrigation ? `rgba(0,200,170,255)` : '#999');
        }
    }, soilmonitor.interval);

    setInterval(() => {
        if (client.client.connected) {
          airmonitor.checkCondition();
          setText2(airmonitor.mistSpray ? 'On'  : 'Off');
          setColor2(airmonitor.mistSpray ? '#04d9ff' : '#999');
        }
    }, airmonitor.interval);

    setInterval(() => {
      if (client.client.connected) {
        lightmonitor.checkCondition();
        setText3(lightmonitor.net ? 'On' : 'Off');
        setColor3(lightmonitor.net ? 'yellow' : '#999');
        // if (lightmonitor.net == true){
        //   setText3('On');
        //   setColor3('yellow');
        // } else {
        //   setText3('Off');
        //   setColor3('#999');
        // }
      }
    }, lightmonitor.interval);
    ////////////////////////
    return subscriber; // unsubscribe on unmount
  }, []);
  if (initializing) return null;
  if (!user) {
    return navigation.navigate('Login');
  }

  const logoff = () => {
    auth()
    .signOut()
    .then(()=>console.log('User signed out'))
  }

  function change1(){
    if(text1 === 'Off'){
      setText1('On');
      setColor1(`rgba(0,200,170,255)`);
    }
    else if(text1 === 'On'){
      setText1('Off');
      setColor1('#999')
    }
  }
  function change2(){
    if(text2 === 'Off'){
      setText2('On');
      setColor2('#04d9ff');
    }
    else if(text2 === 'On'){
      setText2('Off');
      setColor2('#999')
    }
  }
  function change3(){
    if(text3 === 'Off'){
      setText3('On');
      setColor3('yellow');
    }
    else if(text3 === 'On'){
      setText3('Off');
      setColor3('#999')
    }
  }
  const Separator = () => {
    return(
        <View style={styles.separator}/>
    )
  }

  return (
    <View style={styles.container}>
      <Image source = {require('./pap-logo.png')}
          style = {{width:100,height:100}}
      />
      <Text style={styles.welcomeText}>Welcome {user.email} ! </Text>
      <Text style={styles.welcomeText}>Your Garden's personal Caretaker</Text>

      <View style={styles.btnContainer}>
      
      <View style={{backgroundColor:'#353c57',width:150,height:160,borderRadius:20,justifyContent:'center',alignItems:'center',marginRight:25}}>
          <Text style={{color:`rgba(0,200,170,255)`,fontWeight:'bold',marginBottom: 10}}>Soil Irrigation</Text>
          <TouchableOpacity style={[styles.soilBtn,{borderColor:borderColor1}]} onPress = {change1}>
          <Text style={styles.text1}>{text1}</Text>
          </TouchableOpacity>
      </View>
      
      <View style={{backgroundColor:'#353c57',justifyContent:'center',alignItems:'center',textAlign:'center',width:150,height:160,borderRadius:25}}>
      <Text style={{color:'#04d9ff',alignSelf:'center',fontWeight:'bold',marginBottom:10}}>Mist spray</Text>
      <TouchableOpacity style={[styles.mistBtn,{borderColor:borderColor2}]} onPress = {change2}>
        <Text style={styles.text2}>{text2}</Text>
      </TouchableOpacity>
      </View>
    </View>
    <View style={{backgroundColor:'#353c57',justifyContent:'center',alignItems:'center',textAlign:'center',width:150,height:160,borderRadius:25,marginTop:20}}>
      <Text style={{color:'yellow',fontWeight:'bold',marginTop:10}}>Shading Net</Text>
      <TouchableOpacity style={[styles.netBtn,{borderColor:borderColor3}]}onPress = {change3}>
        <Text style={styles.text3}>{text3}</Text>
      </TouchableOpacity>
    </View>
    </View>
  );
}

//Home.navigationOptions = ({ navigation }) => ({
  //title: 'Home',
  //headerRight: () => <Button
    //      buttonStyle={{ padding: 0, marginRight: 20, backgroundColor: 'transparent' }}
      //    icon={
        //      <Icon
          //        name="cancel"
            //      size={28}
              //    color="white"
              ///>
         // }
          //onPress={() => {auth().signOut()}} />,
//});
const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center' ,
    backgroundColor:'#20222f'
  },

  welcomeText:{
    fontSize: 20,
    textAlign: 'center',
    color:'grey'
  },

  soilBtn:{
    width:100,
    height:100,
    borderRadius:100,
    borderWidth:10,
    //borderColor:`rgba(0,200,170,255)`,
    backgroundColor:'#353c57',
    alignItems:'center',
    justifyContent:'center',
    //marginRight:90
  },

  mistBtn:{
    width:100,
    height:100,
    borderRadius:100,
    borderWidth:10,
    //borderColor:'blue',
    backgroundColor:'#353c57',
    alignItems:'center',
    justifyContent:'center',
  },

  btnContainer:{
    flexDirection:'row',
    marginTop:20,
    backgroundColor:'#20222f'
  },

  netBtn:{
    width:100,
    height:100,
    borderRadius:100,
    backgroundColor:'#353c57',
    borderColor:'yellow',
    borderWidth:10,
    alignItems:'center',
    justifyContent:'center',
    marginTop:10
  },

  text1:{
    color:`rgba(0,200,170,255)`
  },

  text2:{
    color:'#04d9ff'
  },

  text3:{
    color:'yellow'
  },

  separator:{
    borderBottomColor: 'grey',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 15
  }
})