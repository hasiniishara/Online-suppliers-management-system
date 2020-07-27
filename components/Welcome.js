import React, { Component } from 'react';
import { Button, Text, PricingCard,Icon,Avatar  } from 'react-native-elements';
import { StyleSheet, View, ImageBackground,Image,TouchableOpacity } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import BG from '../images/bg.jpg';



class Welcome extends  React.Component{

    render(){
    return (
    
      <View style={styles.container}>
          <ImageBackground
          style={styles.logoContainer}
          source={BG} 
          >
           { /* <PricingCard
             color="#4f9deb"
             title="YummyCake"
             price="Join With Us"
             info={[' User', 'Basic Support', 'All Core Features']}
             button={{ title: 'GET STARTED', icon: 'flight-takeoff'}}
             onButtonPress={() =>
                this.props.navigation.navigate('LoginForm')
              }
            />*/}
            <Text 
            style={styles.cakeText}
            >
            YummyCake
            </Text> 
            
            <Avatar
                size="xlarge"
                overlayContainerStyle={{backgroundColor: '#49A09F'}}
                rounded
                raised
                icon={{name: 'home', type: 'font-awesome'}}
                onPress={() =>  this.props.navigation.navigate('LoginForm')}
                activeOpacity={0.7}
                containerStyle={{ marginRight: 10,marginTop:50}}
              />
              <Text 
              style={styles.loginText}
              >
              Press here to sell your Yummy Cakes!
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
      textAlign: 'center',
      marginTop:30,
      fontSize:15,
    },
    cakeText: {
      color: '#49A09F',
      textAlign: 'center',
      marginTop:1,
      fontSize:40,
    },
    logoContainer:{
      flex: 1,
      alignItems:'center',
      justifyContent: 'center',
      height:'100%',
      width:'100%'
    },
    buttonContainer2:{
      marginTop:60,
      backgroundColor:'#3B3B98',
      padding:15,
      borderRadius:8
    },
  });
  export default Welcome;