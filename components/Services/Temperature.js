import React, {useEffect, useState, useContext} from 'react';
import {View,Text,Dimensions,StyleSheet,TouchableOpacity, SafeAreaView,FlatList,Image} from 'react-native';
import {LineChart,ProgressChart} from 'react-native-chart-kit';
import { ScrollView } from 'react-native-gesture-handler';
import ProgressCircle from 'react-native-progress-circle';
import {AppStateContext} from '../../App';
import {AirMonitor,MqttClient} from '../mqtt';
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const Separator = () => {
    return(
        <View style={styles.separator}/>
    )
}
const chartConfig = {
    backgroundGradientFrom: '#353c57',
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: '#353c57',
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => `rgba(255,49,49,${opacity})`,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
}

const data = [
    {
        id: "1",
        title: "DHT11",
        source: require('./DHT11.jpg')
    },
    
    {
        id: "2",
        title: "Water Pumper",
        source: require('./pumper.png')
    }
]

const Item = ({source,title}) => (
    <View style={styles.item}>
    <Image
        source={source}
        style={{height:30,width:30}}/>
    <Text style={styles.title}>{title}</Text>
    </View>
);


export default function App({navigation}){
    // const [temp,setTemp] = useState([0,0,0]);
    const [per3,setPercent3] = useState(0);

    const MqttObj = useContext(AppStateContext);
    const client = MqttObj.client;
    const soilmonitor = MqttObj.soilmonitor;
    const airmonitor = MqttObj.airmonitor;
    const lightmonitor = MqttObj.lightmonitor;
	const database = MqttObj.database;
	const temp = database.temperature;
    useEffect(() => {
        // Update the document title using the browser API
        // console.log('ok');
        //let client = new MqttClient(callback);
        //setClient(new MqttClient(callback));
        setPercent3(client.temp);

    }, [client.temp]);

    useEffect(() => {
        setInterval(() => {
            if (client.client.connected) { airmonitor.checkCondition(); }
        }, 1000);
        // setInterval(async () => {
        //     let db = await MqttObj.db;
        //     let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        //     let [result] = await db.executeSql('INSERT INTO temperature(time, value) VALUES (?,?)', [date, client.temp]);
        //     console.log('Results', result.rowsAffected);
        //     if (result.rowsAffected > 0) {
        //         console.log('Success');
        //     } else {
        //         console.log('Registration Failed');
        //     }
        // }, 300000);
		setInterval(async () => await database.updateData('temperature', client.temp), 300000);
		// database.fetchData('temperature', setTemp);
	// setTemp(database.temperature);
    }, []);

    // useEffect(() => {
    //     const fetchTempData = async db => {
    //         let [result] = await db.executeSql('SELECT * FROM temperature ORDER BY time DESC LIMIT 5');
    //         var rows = result.rows;
    //         if (rows.length > 0) {
    //             let tempList = [...Array(rows.length).keys()].map(i => rows.item(i).value);
    //             setTemp(tempList.reverse());
    //         }
    //     };
    //     MqttObj.db.then(fetchTempData);
    // }, []);

    const renderItem = ({item}) => (
        <Item title={item.title} source={item.source}/>
    );
    const data2 = {
        labels: ["20'","15'","10'","5'","Now"],
        datasets: [
        {
            data: temp,
            strokeWidth: 4.5
        }
        ],
        legend:["Temperature"]
      }
    return(
        <SafeAreaView style = {styles.container}>
        <View style={styles.progress}>
            <ProgressCircle
                percent={per3}
                radius={50}
                borderWidth={8}
                color={`rgba(255,49,49,255)`}
                shadowColor="#999"
                bgColor={'#20222f'}
                style={styles.progress}
                //rgba(255,49,49,255)

            >
            <Text style={{color:`rgba(255,49,49,255)`}}>{per3 + 'ºC'}</Text>
            </ProgressCircle>
            <Text style={{color:`rgba(255,49,49,255)`,marginTop:10}}>Temperature</Text>
        </View>
        <Text style={{color:'lightgrey',marginBottom:10,fontWeight:'bold'}}>
            ____________________________________________________
        </Text>
        <LineChart
            data = {data2}
            width = {screenWidth/1.2}
            height = {screenHeight/3.8}
            chartConfig = {chartConfig}
            style = {styles.lineBackGround}
        />
        <Text style={styles.text}>Devices</Text>
        <Text style={{color:'lightgrey',marginTop:-10,fontWeight:'bold'}}>
            ____________________________________________________
        </Text>
        <View style={styles.devices}>
        <FlatList
           data={data}
           renderItem={renderItem}
           keyExtractor={(item) => item.id}
        />
        </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#20222f'
    },
    button: {
        backgroundColor: 'green',
        height: 40,
        width: 110,
        borderRadius: 30,
        justifyContent: 'center',
        marginTop: 10
    },
    text: {
        fontSize: 20,
        marginTop: 10,
        color:'cyan'
    },
    progress:{
        alignItems:'center',
        justifyContent:'center',
        marginTop: 50,
        marginBottom: 20
    },
    devices:{
        flex: 1,
        width:screenWidth/1.1
    },
    item:{
        backgroundColor:'#353c57',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        flexDirection:'row',
        borderRadius:10
    },
    title:{
        fontSize: 20,
        marginLeft:10,
        color:`rgba(0,200,170,255)`
    },
    separator:{
        borderBottomColor: 'azure',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginTop:11,
        marginBottom: 15
    },
    lineBackGround:{
        borderRadius: 25
    }
})