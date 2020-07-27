import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity,Alert,ScrollView ,ActivityIndicator,Button } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import firebase from './database';
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

class ViewProduct extends Component{
  
  constructor() {
        super();
        this.firestoreRef = firebase.firestore().collection('form');
        this.state = {
          isLoading: true,
          proArr: [],
          text: '',
          dataArr:[]
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
 
    navPro(email){
      const { navigation } = this.props;
      console.log(email);
      Alert.alert(
        'Oder Item',
        'Are you sure?',
        [
          {text: 'Yes', onPress: () => this.props.navigation.navigate('Order',{emailArray: `${JSON.stringify(email)}`})},
          {text: 'No', onPress: () => console.log('No item was ordered'), style: 'cancel'},
        ],
        { 
          cancelable: true 
        }
      );
      
    }
    SearchFilterFunction(text) {
      //passing the inserted text in textinput
     
      const newData = this.state.proArr.filter((item) => {
        //applying filter for the inserted text in search bar
        const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      this.setState({
        proArr: newData,
        text: text,
      });
      
    }
    componentDidMount() {
        this.unsubscribe = this.firestoreRef.onSnapshot(this.getCollection);
    }
    componentWillUnmount(){
        this.unsubscribe();
    }
    getCollection = (querySnapshot) => {
      const proArr = [];
        querySnapshot.forEach((res) => {
          const { name, email, mobile, price, address } = res.data();
          
          proArr.push({
            key: res.id,
            res,
            name,
            email,
            mobile,
            price,
            address
          });
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
        <SearchBar
        placeholder="Type Here..."
        onChangeText={text => this.SearchFilterFunction(text)}
        value={this.state.text}
        />
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
                  <Card key={i} title={item.name}>
                    <Text>Price Per Kilo : Rs.{item.price}.00</Text>
                    <Text>Name : {item.name}</Text>
                    <Text>Mobile : {item.mobile}</Text>
                    <Text>Email : {item.email}</Text>
                    <Text>Address : {item.address}</Text>
                    {((JSON.parse(navigation.getParam('emailArray'))) === 'admin1234@gmail.com')?
                    (<View style={styles.button}>
                      <Button
                        title='Order Cake' 
                        onPress={() => this.navPro(item.email)}
                        color="#19AC52"
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
    button: {
      marginBottom: 7, 
    },
    buttonText:{
      textAlign:'center',
      color:'#fff',
      fontWeight:'bold',
      fontSize:20
    },
  });
  
  export default ViewProduct;