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

class ViewOrders extends Component{
  
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
    accept(key) {

      Alert.alert(
        'Accept Order',
        'Are you sure?',
        [
          {text: 'Yes', onPress: () => {
        this.setState({
          isLoading: true,
        });
        const updateDBRef = firebase.firestore().collection('order').doc(key);
        updateDBRef.update({
          state:'accept'
        }).then((docRef) => {
          this.props.navigation.navigate('ViewOrders');
           Alert.alert('You Accept  this order!')
        })
        .catch((error) => {
          console.error("Error: ", error);
          this.setState({
            isLoading: false,
          });
        });
      }
    },
    {text: 'No', onPress: () => console.log('No item was Accepted'), style: 'cancel'},
    ],
    { 
    cancelable: true 
    }
    );
      }

     reject(key) {

      Alert.alert(
        'Reject Order',
        'Are you sure?',
        [
          {text: 'Yes', onPress: () => {
        this.setState({
          isLoading: true,
        });
        const updateDBRef = firebase.firestore().collection('order').doc(key);
        updateDBRef.update({
          state:'reject'
        }).then((docRef) => {
          this.props.navigation.navigate('ViewOrders');
          Alert.alert('You Reject this order!')
        })
        .catch((error) => {
          console.error("Error: ", error);
          this.setState({
            isLoading: false,
          });
        });
      }
    },
    {text: 'No', onPress: () => console.log('No item was Rejected'), style: 'cancel'},
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
      const { navigation } = this.props;
      const proArr = [];
      const mail= JSON.parse(navigation.getParam('emailArray'));
      console.log(mail);
      console.log("get email")
        querySnapshot.forEach((res) => {
          const { name, email, mobile, address, kilo, type, proOwnerEmail, noOrders,state } = res.data();
          if(res.data().proOwnerEmail.trim() == mail.trim() ){
            if(res.data().state == 'pending'){
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
            noOrders,
            state
          });
        }
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
                    {((JSON.parse(navigation.getParam('emailArray'))) !== 'admin1234@gmail.com')?
                    (<View style={styles.but}>
                      <Button
                        style={styles.button1}
                        title='Accept' 
                        onPress={() => this.accept(item.key)}
                        color="#19AC52"
                      />
                      <Button
                        style={styles.button2}
                        title='Reject' 
                        onPress={() => this.reject(item.key)}
                        color="#E37399"
                      />
                    </View>):null
                  }
                    
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
    logoutText: {
      marginLeft:250,
      
    },
    icon:{
      marginTop:10,
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
      justifyContent: 'space-between'
    },
    button2: {
      marginBottom: 1,    
      },
    buttonText:{
      textAlign:'center',
      color:'#fff',
      fontWeight:'bold',
      fontSize:20
    },
    but:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
  });
  
  export default ViewOrders;