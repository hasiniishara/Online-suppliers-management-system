import React from 'react';
import firebase from 'firebase';
import { Icon,Avatar } from 'react-native-elements';
import { StyleSheet, Text, View, TouchableOpacity,ImageBackground,Alert} from 'react-native';
import BG from '../images/bg.jpg';

class Home extends React.Component {
  constructor() {
    super();
    
    this.state={
      getEmail:''
    }
    
  }
  navPro2(){
    const { navigation } = this.props;
    this.props.navigation.navigate('ViewProduct',{emailArray:`${JSON.stringify(JSON.parse(navigation.getParam('emailArray')))}`});
  }
  navPro3(){
    const { navigation } = this.props;
    this.props.navigation.navigate('AcceptedOrders',{emailArray:`${JSON.stringify(JSON.parse(navigation.getParam('emailArray')))}`});
  }
  navPro4(){
    const { navigation } = this.props;
    this.props.navigation.navigate('OrderStatus',{emailArray:`${JSON.stringify(JSON.parse(navigation.getParam('emailArray')))}`});
  }

  navPro(){
    const { navigation } = this.props;
    this.props.navigation.navigate('ViewUsers',{emailArray:`${JSON.stringify(JSON.parse(navigation.getParam('emailArray')))}`});
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

render()  {
  return (
    <View style={styles.container}>
    <ImageBackground
    style={styles.logoContainer}
    source={BG} 
    >
            <View>
                <TouchableOpacity style={styles.buttonContainer1} 
                onPress={() => this.navPro()}>
                <Text style={styles.buttonText}>Manage Users</Text> 
                 </TouchableOpacity>

                <TouchableOpacity style={styles.buttonContainer2} 
                onPress={() => this.navPro2()}
                /*onPress={() => this.props.navigation.navigate('ViewProduct')}*/>
                <Text style={styles.buttonText}>Order Products</Text> 
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonContainer2} 
                onPress={() => this.navPro3()}>
                <Text style={styles.buttonText}>Accepted Orders</Text> 
                </TouchableOpacity>

                {/*<TouchableOpacity style={styles.buttonContainer2} 
                onPress={() => this.navPro4()}>
                <Text style={styles.buttonText}>Order Status</Text> 
                </TouchableOpacity>*/}
                <View style={styles.icon}>
                <Icon
                containerStyle={styles.keyText}
                raised
                name='key'
                type='font-awesome'
                color='#f50'
                onPress={() => this.navPro4()} />
                <Icon
                containerStyle={styles.logoutText}
                raised
                name='heartbeat'
                type='font-awesome'
                color='#f50'
                onPress={() => this.signOut()} />
                </View>
                <View style={styles.txt}>
                <Text 
                style={styles.historyText}>
                  Order  History
                </Text> 
                <Text 
                style={styles.logText}>
                  Logout
                </Text> 
                </View>
            </View>
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
  logoutText: {
    marginLeft:50,
    
  },
  historyText: {
    marginLeft:10,
   
  },
  logText: {
    marginLeft:50,
    
  },
  keyText: {
    marginLeft:10,
   
  },
  icon:{
    marginTop:50,
    flexDirection: 'row',
    justifyContent: 'space-between'
 },
 txt:{
  marginTop:2,
  flexDirection: 'row',
  justifyContent: 'space-between'
},
  homeContainer:{
     padding:20,
     marginTop:50
  },
  buttonText:{
    textAlign:'center',
    color:'#fff',
    fontWeight:'bold',
    fontSize:20
  },
  buttonContainer1:{
    marginTop:1,
    backgroundColor:'#49A09F',
    padding:15,
    borderRadius:8
  },
  buttonContainer2:{
    marginTop:60,
    backgroundColor:'#49A09F',
    padding:15,
    borderRadius:8
  },
  buttonContainer3:{
    marginTop:70,
    backgroundColor:'#49A09F',
    padding:15,
    borderRadius:8
  },
  logoContainer:{
    flex: 1,
    alignItems:'center',
    justifyContent: 'center',
    height:'100%',
    width:'100%'
  },
});

export default Home;