import React, { Component }  from 'react';
import firebase from 'firebase';
import { Alert, Button, StyleSheet, TextInput, ScrollView, ActivityIndicator, View  } from 'react-native';



class UserDetails extends Component {
    constructor() {
        super();
        this.state = {
          name: '',
          email: '',
          mobile: '',
          isLoading: true
        };
      }
     
      componentDidMount() {
        const { navigation } = this.props;
        console.log(navigation);
        const dbRef = firebase.firestore().collection('users').doc(JSON.parse(navigation.getParam('userkey')))
        dbRef.get().then((res) => {
          if (res.exists) {
            const user = res.data();
            this.setState({
              key: res.id,
              name: user.name,
              email: user.email,
              mobile: user.mobile,
              isLoading: false
            });
          } else {
            console.log("Document does not exist!");
          }
        });
      }
    
      inputValueUpdate = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
      }
    
      
      deleteUser() {
        const { navigation } = this.props;
        const dbRef = firebase.firestore().collection('users').doc(JSON.parse(navigation.getParam('userkey')))
          dbRef.delete().then((res) => {
              console.log('Item removed from database')
              Alert.alert('Deletion success!');
              this.props.navigation.navigate('ViewUsers');
          })
      }
    
      openDeleteAlert=()=>{
        Alert.alert(
          'Delete User',
          'Are you sure?',
          [
            {text: 'Yes', onPress: () => this.deleteUser()},
            {text: 'No', onPress: () => console.log('No user was removed'), style: 'cancel'},
          ],
          { 
            cancelable: true 
          }
        );
      }
    
      render() {
        if(this.state.isLoading){
          return(
            <View style={styles.preloader}>
              <ActivityIndicator size="large" color="#9E9E9E"/>
            </View>
          )
        }
        return (
          <ScrollView style={styles.container}>
            <View style={styles.inputGroup}>
              <TextInput
                  placeholder={'Name'}
                  value={this.state.name}
                  onChangeText={(val) => this.inputValueUpdate(val, 'name')}
              />
            </View>
            <View style={styles.inputGroup}>
              <TextInput
                  multiline={true}
                  numberOfLines={4}
                  placeholder={'Email'}
                  value={this.state.email}
                  onChangeText={(val) => this.inputValueUpdate(val, 'email')}
              />
            </View>
            <View style={styles.inputGroup}>
              <TextInput
                  placeholder={'Mobile'}
                  value={this.state.mobile}
                  onChangeText={(val) => this.inputValueUpdate(val, 'mobile')}
              />
            </View>
             <View>
              <Button
                title='Delete'
                onPress={this.openDeleteAlert}
                color="#E37399"
              />
            </View>
          </ScrollView>
        );
      }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 35
      },
      inputGroup: {
        flex: 1,
        padding: 0,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
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
      button: {
        marginBottom: 7, 
      }
});

export default UserDetails;