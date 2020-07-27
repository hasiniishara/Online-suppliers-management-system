import React, { Component }  from 'react';
import firebase from 'firebase';
import { Alert, Button, StyleSheet, TextInput, ScrollView, ActivityIndicator, View  } from 'react-native';



class Details extends Component {
    constructor() {
        super();
        this.state = {
          name: '',
          email: '',
          mobile: '',
          price: '',
          address:'',
          isLoading: true
        };
      }
     
      componentDidMount() {
        const { navigation } = this.props;
        console.log(navigation);
        const dbRef = firebase.firestore().collection('form').doc(JSON.parse(navigation.getParam('userkey')))
        dbRef.get().then((res) => {
          if (res.exists) {
            const user = res.data();
            this.setState({
              key: res.id,
              name: user.name,
              email: user.email,
              mobile: user.mobile,
              price: user.price,
              address: user.address,
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
    
      updateUser() {
        this.setState({
          isLoading: true,
        });
        const updateDBRef = firebase.firestore().collection('form').doc(this.state.key);
        updateDBRef.set({
          name: this.state.name,
          email: this.state.email,
          mobile: this.state.mobile,
          price: this.state.price,
          address: this.state.address
        }).then((docRef) => {
         this.setState({
            key: '',
            name: '',
            email: '',
            mobile: '',
            price: '',
            address: '',
            isLoading: false,
          });
          this.props.navigation.navigate('ViewUsers');
        })
        .catch((error) => {
          console.error("Error: ", error);
          this.setState({
            isLoading: false,
          });
        });
      }
    
      deleteUser() {
        const { navigation } = this.props;
        const dbRef = firebase.firestore().collection('form').doc(JSON.parse(navigation.getParam('userkey')))
          dbRef.delete().then((res) => {
              console.log('Item removed from database')
              this.props.navigation.navigate('ViewProduct');
          })
      }
      openUpdateAlert=()=>{
        Alert.alert(
          'Update Details',
          'Are you sure?',
          [
            {text: 'Yes', onPress: () => this. updateUser()},
            {text: 'No', onPress: () => console.log('No item was updated'), style: 'cancel'},
          ],
          { 
            cancelable: true 
          }
        );
      }
    
      openDeleteAlert=()=>{
        Alert.alert(
          'Delete User',
          'Are you sure?',
          [
            {text: 'Yes', onPress: () => this.deleteUser()},
            {text: 'No', onPress: () => console.log('No item was removed'), style: 'cancel'},
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
            <View style={styles.inputGroup}>
              <TextInput
                  multiline={true}
                  placeholder={'Price'}
                  value={this.state.price}
                  onChangeText={(val) => this.inputValueUpdate(val, 'price')}
              />
            </View>
            <View style={styles.inputGroup}>
              <TextInput
                  multiline={true}
                  placeholder={'Address'}
                  value={this.state.address}
                  onChangeText={(val) => this.inputValueUpdate(val, 'address')}
              />
            </View>
            <View style={styles.button}>
              <Button
                title='Update'
                onPress={this.openUpdateAlert} 
                color="#19AC52"
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

export default Details;