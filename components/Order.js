import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity,Alert, Picker } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import firebase from './database';
import { YellowBox } from 'react-native';
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
class Order extends Component{

  constructor() {
    super();
    YellowBox.ignoreWarnings(['Setting a timer']);
    this.db= firebase.firestore().collection('order');
    this.state = { 
      name: '',
      mobile:'',
      email: '', 
      address:'',
      kilo:'',
      type:'',
      noOrders:'',
      accept:'',
      isLoading: false
    }
  }
  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }
  addForm = () => {
    Alert.alert(
      'Oder Item',
      'Are you sure?',
      [
        {text: 'Yes', onPress: () => {
          
        const { navigation } = this.props;
        if(this.state.name === '' || this.state.mobile === '' || this.state.email === '' || 
         this.state.address=== '' || this.state.kilo=== ''|| this.state.type=== ''|| this.state.noOrders==='') {
          Alert.alert('Enter details!')
        } else {
          this.setState({
            isLoading: true,
          });
          console.log(this.state.name);
          firebase.firestore().collection('order').add({
          name: this.state.name,
          mobile: this.state.mobile,
          email: this.state.email, 
          address:this.state.address,
          kilo:this.state.kilo,
          type: this.state.type,
          noOrders:this.state.noOrders,
          state:'pending',
          proOwnerEmail:(JSON.parse(navigation.getParam('emailArray')))
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
              address:'',
              kilo:'',
              type: '',
              noOrders:''
            })
            this.props.navigation.navigate('ViewProduct')
          })
          .catch(error => {
            Alert.alert(error);
          })      
        }
      
      
        }
      
      },
        {text: 'No', onPress: () => console.log('No item was ordered'), style: 'cancel'},
      ],
      { 
        cancelable: true 
      }
    );
    
  }
  render(){
  return (
    <View style={styles.container}>
        <Text style={styles.header}>Order Cakes</Text>  
        <TextInput style={styles.textInput} 
        placeholder="Your Name"
        value={this.state.name}
        onChangeText={(val) => this.updateInputVal(val, 'name')}></TextInput>

        <TextInput style={styles.textInput} 
        placeholder="Mobile Number"
        value={this.state.mobile}
        onChangeText={(val) => this.updateInputVal(val, 'mobile')}></TextInput>

        <TextInput style={styles.textInput} 
        placeholder="Email"
        value={this.state.email}
        onChangeText={(val) => this.updateInputVal(val, 'email')}></TextInput>

        <TextInput style={styles.textInput} 
        placeholder="Address" 
        value={this.state.address}
        onChangeText={(val) => this.updateInputVal(val, 'address')}></TextInput>

        <TextInput style={styles.textInput} 
        placeholder="Number of kilo" 
        value={this.state.kilo}
        onChangeText={(val) => this.updateInputVal(val, 'kilo')}></TextInput>

        
        
        <Picker
        selectedValue={this.state.type}
        style={{ height: 50, width: 335 }}
        onValueChange={(val) => this.updateInputVal(val, 'type')}
        >
        <Picker.Item label="Round/Butter" value="Round/Butter" />
        <Picker.Item label="Round/Chocolate" value="Round/Chocolate" />
        <Picker.Item label="Round/Ribbon" value="Round/Ribbon" />
        <Picker.Item label="Round/ButterIcing" value="Round/ButterIcing" />
        <Picker.Item label="Round/ChocolateIcing" value="Round/ChocolateIcing" />
        </Picker>



        <TextInput style={styles.textInput} 
        placeholder="No of cakes"
        value={this.state.noOrders}
        onChangeText={(val) => this.updateInputVal(val, 'noOrders')}></TextInput>

        <TouchableOpacity style={styles.buttonContainer} onPress={() => this.addForm()}>
           <Text style={styles.buttonText}>Order</Text> 
        </TouchableOpacity>
    </View>
  );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:20,
    justifyContent: 'center',
  },
  header:{
    fontSize:24,
    fontWeight:'bold',
    color:'#49A09F',
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
  buttonContainer:{
    backgroundColor:'#49A09F',
    padding:15,
    borderRadius:8
  },
  buttonText:{
    textAlign:'center',
    color:'#fff',
    fontWeight:'bold',
    fontSize:20
  },
});

export default Order;