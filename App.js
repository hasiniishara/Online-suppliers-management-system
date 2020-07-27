import React, { Component } from 'react';
import { StyleSheet, Text } from 'react-native';
import LoginForm from './components/LoginForm';
import Home from './components/Home';
import AdminHome from './components/AdminHome';
import Welcome from './components/Welcome';
import Signup from './components/Signup';
import AddForm from './components/AddForm';
import ViewProductDetails  from './components/ViewProductDetails';
import ViewProduct from './components/ViewProduct';
import ViewUsers from './components/ViewUsers';
import Details from './components/Details';
import UserDetails from './components/UserDetails';
import Order from './components/Order';
import OrderHistory from './components/OrderHistory';
import ViewOrders from './components/ViewOrders';
import AcceptedOrders from './components/AcceptedOrders';
import OrderStatus from './components/OrderStatus';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';


const AppNavigator = createStackNavigator({
  Home: {
    screen: Home
  },
  AdminHome: {
    screen: AdminHome
  },
  Order:{
    screen: Order
  },
  OrderHistory:{
    screen: OrderHistory
  },
  ViewOrders:{
    screen: ViewOrders
  },
  AcceptedOrders:{
    screen: AcceptedOrders
  },
  OrderStatus:{
    screen: OrderStatus
  },
  Details:{
    screen: Details
  },
  UserDetails:{
    screen: UserDetails
  },
  ViewProductDetails :{
    screen: ViewProductDetails 
  },
  ViewUsers :{
    screen: ViewUsers 
  },
  ViewProduct:{
    screen: ViewProduct
  },
  AddForm:{
    screen: AddForm
  },
  LoginForm: {
    screen: LoginForm
  },
  Signup: {
    screen: Signup
  },
  Welcome:{
    screen: Welcome
  }
},{
  initialRouteName: "Welcome"
});

const AppContainer = createAppContainer(AppNavigator);
class App extends  React.Component{

  render(){
  return (
    <AppContainer/>
  );
  }
}

export default App;