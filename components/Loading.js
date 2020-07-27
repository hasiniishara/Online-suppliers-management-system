import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';

const Loading =()=> {
  return (
    <View style={styles.container}>
        <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'center',
    alignItems:'center'
    
  },
});

export default Loading;