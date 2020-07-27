import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity,Alert,ImageBackground,ActivityIndicator } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import firebase from './database';
import { YellowBox } from 'react-native';
import {Platform, InteractionManager} from 'react-native';
import { Icon } from 'react-native-elements';
import BG from '../images/bg.jpg';
import {decode, encode} from 'base-64';

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
class AddForm extends Component{

  constructor() {
    super();
    YellowBox.ignoreWarnings(['Setting a timer']);
    this.db= firebase.firestore().collection('form');
    this.state = { 
      name: '',
      mobile:'',
      email: '', 
      price: '',
      address:'',
      emailError: '',
      mobileError: '',
      isLoading: false
    }
  }
  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
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
  validate = () => {
    let emailError = "";
    let mobileError = "";
    if (!this.state.email.includes('@')) {
        emailError = 'invalid email';
    }
    if (this.state.mobile.length !== 10) {
        mobileError = 'invalid mobile number';
    }

    if (emailError || mobileError) {
        this.setState({ emailError, mobileError });
        return false;
    }
    return true;
}
  addForm = () => {
    const isValid = this.validate();
    if (isValid) {
    Alert.alert(
      'Add Item',
      'Are you sure?',
      [
        {text: 'Yes', onPress: () => {
    if(this.state.name === '' || this.state.mobile === '' || this.state.email === '' || this.state.price === '' || this.state.address=== '' ) {
      Alert.alert('Enter details!')
    } else {
      this.setState({
        isLoading: true,
      });
      
      console.log(this.state.name);
      firebase.firestore().collection('form').add({
      name: this.state.name,
      mobile: this.state.mobile,
      email: this.state.email, 
      price: this.state.price,
      address:this.state.address,
      })
      .then((res) => {
        console.log(res);
        console.log('Success!')
        Alert.alert('Success!');
        this.setState({
          isLoading: false,
          name: '',
          email: '', 
          mobile:'',
          price: '',
          address:'',
          emailError: '',
          mobileError: ''
        })
        this.props.navigation.navigate('Home')
      })
      .catch(error => {
        Alert.alert(error);
      })      
    
  }
  }
    },
    {text: 'No', onPress: () => console.log('No item was Added'), style: 'cancel'},
    ],
    { 
    cancelable: true 
    }
    );
  }
  }
  render(){
    if(this.state.isLoading){
      return(
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E"/>
        </View>
      )
    }   
  return (
    <View style={styles.container}>
      <ImageBackground
      style={styles.logoContainer}
      source={BG} 
      >
      <View style={styles.icon}>
      <Icon
      containerStyle={styles.logoutText}
      raised
      name='heartbeat'
      type='font-awesome'
      color='#f50'
      onPress={() => this.signOut()} />
      </View>
        <Text style={styles.header}>Add Product</Text>  
        <TextInput style={styles.textInput} 
        placeholder="Your Name"
        value={this.state.name}
        onChangeText={(val) => this.updateInputVal(val, 'name')}></TextInput>

        <TextInput style={styles.textInput} 
        placeholder="Price Per Kilo"
        value={this.state.price}
        onChangeText={(val) => this.updateInputVal(val, 'price')}></TextInput>

        <TextInput style={styles.textInput} 
        placeholder="Mobile Number"
        value={this.state.mobile}
        onChangeText={(val) => this.updateInputVal(val, 'mobile')}></TextInput>
        {(this.state.mobileError)?(<Text style={styles.error}>{this.state.mobileError}</Text>):null}

        <TextInput style={styles.textInput} 
        placeholder="Email"
        value={this.state.email}
        onChangeText={(val) => this.updateInputVal(val, 'email')}></TextInput>
        {(this.state.emailError)?(<Text style={styles.error}>{this.state.emailError}</Text>):null}

        <TextInput style={styles.textInput} 
        placeholder="Address" 
        value={this.state.address}
        onChangeText={(val) => this.updateInputVal(val, 'address')}></TextInput>

        <TouchableOpacity style={styles.buttonContainer} onPress={() => this.addForm()}>
           <Text style={styles.buttonText}>Add</Text> 
        </TouchableOpacity>
        </ImageBackground>
    </View>

  );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center',
    height:'100%',
    width:'100%'
  },
  header:{
    fontSize:24,
    fontWeight:'bold',
    color:'#49A09F',
    paddingBottom:10,
    marginBottom:30,
    marginLeft:30,

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
    marginTop:1,
 },
 error: {
  color: 'red',
  textAlign: 'center'
},
  textInput:{
    height:40,
    width:300,
    backgroundColor:'rgba(255,255,255,.5)',
    paddingLeft:10,
    marginBottom:15,
    borderRadius:5,
    fontSize:15,
  },
  buttonContainer:{
    backgroundColor:'#49A09F',
    padding:15,
    borderRadius:8,
    width:300
  },
  buttonText:{
    textAlign:'center',
    color:'#fff',
    fontWeight:'bold',
    fontSize:20
  },
  logoContainer:{
    flex: 1,
    alignItems:'center',
    justifyContent: 'center',
    height:'100%',
    width:'100%'
  },
});

export default AddForm;