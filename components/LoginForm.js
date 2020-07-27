import React, {Component} from 'react';
import firebase from './database';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Avatar  } from 'react-native-elements';
import { StyleSheet, Text, View, TextInput, TouchableOpacity,Alert, ActivityIndicator,ImageBackground} from 'react-native';
import BG from '../images/bg.jpg';
class LoginForm extends React.Component {
  
  constructor() {
    super();
    this.state = { 
      email: '', 
      password: '',
      sendEmail:'',
      isLoading: false
    }
  }
  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }
  userLogin = () => {
    if(this.state.email === '' || this.state.password === '') {
      Alert.alert('Enter details to signin!')
    } else {
      this.setState({
        isLoading: true,
      })
     firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email.trim(), this.state.password.trim())
      .then((res) => {
        console.log(res)
        console.log('User logged-in successfully!')
        if(this.state.email.trim() === 'admin1234@gmail.com'){
              console.log('this is the admin');
              this.setState({
                isLoading: false,
                email: '', 
                password: '',
                sendEmail:this.state.email.trim()
              })
              console.log(this.state.sendEmail);
              this.props.navigation.navigate('AdminHome',{emailArray: `${JSON.stringify(this.state.sendEmail)}`})
             
        }else{

          this.setState({
            isLoading: false,
            email: '', 
            password: '',
           sendEmail:this.state.email.trim()
          })
          this.props.navigation.navigate('Home',{emailArray:`${JSON.stringify(this.state.sendEmail)}`})
          console.log('this is customer');
        }
      
      })
      .catch(error => {
        console.log(error);
        alert('invalid login')
        this.setState({ errorMessage: error.message });
        this.props.navigation.navigate('Welcome')
      })
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
        <TextInput 
          placeholder="email" 
          style={styles.input} 
          value={this.state.email}
          onChangeText={(val) => this.updateInputVal(val, 'email')}
          />
        <TextInput 
          placeholder="password" 
          style={styles.input} 
          value={this.state.password}
          onChangeText={(val) => this.updateInputVal(val, 'password')}
          maxLength={18}
          secureTextEntry={true}
          />
        <TouchableOpacity style={styles.buttonContainer} onPress={() => this.userLogin()}>
           <Text style={styles.buttonText}>SignIn</Text> 
        </TouchableOpacity>
        <Text style={styles.errorText}>
                {this.state.error}
        </Text>

        <Text 
          style={styles.loginText}
          onPress={() => this.props.navigation.navigate('Signup')}>
          Don't have account? Click here to signup
        </Text>  
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
  loginText: {
    color: '#49A09F',
    textAlign: 'center'
  },
  input:{
    height:40,
    width:300,
    backgroundColor:'rgba(255,255,255,.5)',
    paddingLeft:10,
    marginTop:15,
    marginBottom:15,
    borderRadius:5,
    fontSize:15,
  },
  errorText:{
    fontSize:25,
    color:'red',
    alignSelf:'center',
    marginTop:10
  },
  buttonText:{
    textAlign:'center',
    color:'#fff',
    fontWeight:'bold',
    fontSize:20
  },
  buttonContainer:{
    backgroundColor:'#49A09F',
    padding:14,
    borderRadius:8,
    width:300
  },
  header:{
    fontSize:24,
    alignSelf:'center',
    fontWeight:'bold',
    color:'#49A09F',
    paddingBottom:10,
    marginBottom:50,
    marginLeft:1,
  },
  logoContainer:{
    flex: 1,
    alignItems:'center',
    justifyContent: 'center',
    height:'100%',
    width:'100%'
  },
});

export default LoginForm;