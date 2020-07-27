import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity,Alert,ScrollView ,ActivityIndicator,Button } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import firebase from 'firebase';
import { YellowBox } from 'react-native';
import { ListItem,Card,SearchBar,Icon } from 'react-native-elements';
import {Platform, InteractionManager} from 'react-native';
import {decode, encode} from 'base-64'

if (!global.btoa) {  global.btoa = encode }

if (!global.atob) { global.atob = decode }

const _setTimeout = global.setTimeout;
const _clearTimeout = global.clearTimeout;
const MAX_TIMER_DURATION_MS = 60 * 1000;
if (Platform.OS === 'android') {
    // Work around issue `Setting a timer for long time`
    // see: https://github.com/firebase/firebase-js-sdk/issues/97
    const timerFix = {};
    const runTask = (id, fn, ttl, args) => {
        const waitingTime = ttl - Date.now();
        if (waitingTime <= 1) {
            InteractionManager.runAfterInteractions(() => {
                if (!timerFix[id]) {
                    return;
                }
                delete timerFix[id];
                fn(...args);
            });
            return;
        }

        const afterTime = Math.min(waitingTime, MAX_TIMER_DURATION_MS);
        timerFix[id] = _setTimeout(() => runTask(id, fn, ttl, args), afterTime);
    };

    global.setTimeout = (fn, time, ...args) => {
        if (MAX_TIMER_DURATION_MS < time) {
            const ttl = Date.now() + time;
            const id = '_lt_' + Object.keys(timerFix).length;
            runTask(id, fn, ttl, args);
            return id;
        }
        return _setTimeout(fn, time, ...args);
    };

    global.clearTimeout = id => {
        if (typeof id === 'string' && id.startsWith('_lt_')) {
            _clearTimeout(timerFix[id]);
            delete timerFix[id];
            return;
        }
        _clearTimeout(id);
    };
}

class AcceptedOrders extends Component{
  
  constructor() {
        super();
        this.firestoreRef = firebase.firestore().collection('order');
        this.state = {
          isLoading: true,
          proArr: [],
          text: ''
        };
    }
    signOut = () => {
      Alert.alert(
        'SignOut',
        'Are you sure to sign out?',
        [
          {text: 'Yes', onPress: () => {
      console.log("logout")
      firebase.auth().signOut().then(() => {
        this.props.navigation.navigate('LoginForm')
      })
      .catch(error => this.setState({ errorMessage: error.message }))
      }
    },
    {text: 'No', onPress: () => console.log('Signing in'), style: 'cancel'},
      ],
      { 
      cancelable: true 
      }
      );
    }  
    componentDidMount() {
        this.unsubscribe = this.firestoreRef.onSnapshot(this.getCollection);
    }
    componentWillUnmount(){
        this.unsubscribe();
    }
    getCollection = (querySnapshot) => {
      
      const proArr = [];
      const stat="accept";
        querySnapshot.forEach((res) => {
          const { name, email, mobile, address, kilo, type, proOwnerEmail, noOrders } = res.data();
          console.log(res.data())
          console.log('why')
          
          if(res.data().state === 'accept'){
          proArr.push({
            key: res.id,
            res,
            name,
            email,
            mobile,
            address,
            kilo, 
            type, 
            proOwnerEmail,
            noOrders
          });
        }
        });
       
        this.setState({
          proArr,
          isLoading: false,
       });

    }

    render(){
      const { navigation } = this.props;
      if(this.state.isLoading){
        return(
          <View style={styles.preloader}>
            <ActivityIndicator size="large" color="#9E9E9E"/>
          </View>
        )
      }   
        
    return(
        <ScrollView style={styles.container}>
        <View style={styles.icon}>
              <Icon
              containerStyle={styles.logoutText}
              raised
              name='heartbeat'
              type='font-awesome'
              color='#f50'
              onPress={() => this.signOut()} />
              </View>
        {
            this.state.proArr.map((item, i) => {
                return (
                  <Card key={i} title={item.type}>
                    <Text>Name : {item.name}</Text>
                    <Text>Mobile : {item.mobile}</Text>
                    <Text>Address : {item.address}</Text>
                    <Text>Order Email : {item.email}</Text>
                    <Text>Cake Owner Email : {item.proOwnerEmail}</Text>
                    <Text>Number of kilo : {item.kilo}</Text>
                    <Text>type : {item.type}</Text>
                    <Text>No.of cakes : {item.noOrders}</Text>
                  </Card>
                );
              })
        }
        </ScrollView>
        
    );
}
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: 22
    },
    preloader: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center'
  },
  logoutText: {
    marginLeft:250,
    
  },
  icon:{
    marginTop:10,
 },
    header:{
      fontSize:24,
      fontWeight:'bold',
      paddingBottom:10,
      marginBottom:40,
      marginLeft:90,
  
    },
    textInput:{
      height:40,
      backgroundColor:'rgba(255,255,255,.5)',
      paddingLeft:10,
      marginBottom:15,
      borderRadius:5,
      fontSize:15,
    },
    button1: {
      marginBottom: 7, 
    },
    button2: {
        marginTop:30,
        marginBottom: 58, 
      },
    buttonText:{
      textAlign:'center',
      color:'#fff',
      fontWeight:'bold',
      fontSize:20
    },
  });
  
  export default AcceptedOrders;