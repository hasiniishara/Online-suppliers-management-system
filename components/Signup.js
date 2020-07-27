import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity,Alert, ActivityIndicator,ImageBackground } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Avatar  } from 'react-native-elements';
import firebase from './database';
import BG from '../images/bg.jpg';
class Signup extends Component {
  

  constructor() {
    super();
    this.db= firebase.firestore().collection('users');
    this.state = { 
      name: '',
      mobile:'',
      email: '', 
      password: '',
      isLoading: false
    }
  }
  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }
  registerUser = () => {
    const isValid = this.validate();
    if (isValid) {
    if(this.state.name === '' || this.state.mobile ==' '|| this.state.email === '' || this.state.password === '') {
      Alert.alert('Enter details to signup!')
    } else {
      this.setState({
        isLoading: true,
      });
      this.db.add({
      name: this.state.name,
      mobile: this.state.mobile,
      email: this.state.email, 
      password: this.state.password,
      })
      firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email.trim(), this.state.password.trim())
      .then((res) => {
        console.log(res);
        console.log('User registered successfully!')
        Alert.alert('User registered successfully!');
        this.setState({
          isLoading: false,
          name: '',
          email: '', 
          mobile:'',
          password: '',
          emailError: '',
          mobileError: ''

        })
        this.props.navigation.navigate('LoginForm')
      })
      .catch(error => {
        console.log(error);
        this.setState({ errorMessage: error.message });
        Alert.alert('You email is badly formatted');
        this.props.navigation.navigate('LoginForm');
      })      
    }
  }
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
    <Avatar
    size="large"
    overlayContainerStyle={{backgroundColor: '#49A09F'}}
    rounded
    raised
    icon={{name: 'user', type: 'font-awesome'}}
    onPress={() =>  this.props.navigation.navigate('LoginForm')}
    activeOpacity={0.7}
    containerStyle={{ marginRight: 10,marginTop:5}}
  />

        <TextInput style={styles.textInput} 
         placeholder="Your Name"
         value={this.state.name}
         onChangeText={(val) => this.updateInputVal(val, 'name')}>
         </TextInput>

        <TextInput style={styles.textInput} 
         placeholder="Mobile Number"
         value={this.state.mobile}
         onChangeText={(val) => this.updateInputVal(val, 'mobile')}>
         </TextInput>
         {(this.state.mobileError)?(<Text style={styles.error}>{this.state.mobileError}</Text>):null}

        <TextInput style={styles.textInput} 
         placeholder="Email"
         value={this.state.email}
         onChangeText={(val) => this.updateInputVal(val, 'email')}>
         </TextInput>
         {(this.state.emailError)?(<Text style={styles.error}>{this.state.emailError}</Text>):null}

        <TextInput style={styles.textInput} 
         placeholder="Password" 
         secureTextEntry
         value={this.state.password}
         onChangeText={(val) => this.updateInputVal(val, 'password')}>
         </TextInput>

        <TouchableOpacity style={styles.buttonContainer} onPress={() => this.registerUser()}>
           <Text style={styles.buttonText}>SignUp</Text> 
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
  error: {
    color: 'red',
    textAlign: 'center'
  },
  header:{
    fontSize:24,
    fontWeight:'bold',
    color:'#49A09F',
    paddingBottom:10,
    marginBottom:40,
    marginLeft:10,

  },
  textInput:{
    height:40,
    width:300,
    backgroundColor:'rgba(255,255,255,.5)',
    paddingLeft:10,
    marginTop:15,
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

export default Signup;