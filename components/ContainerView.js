import React from 'react';
import {View, StyleSheet, KeyboardAvoidingView} from 'react-native';

export default function ContainerView({children, keyboardAvoid = false}){
  return (
    keyboardAvoid ?
      <KeyboardAvoidingView style={styles.utilContainer} behavior={'padding'}>
        {children}
      </KeyboardAvoidingView> :
      <View style={styles.utilContainer}>
        {children}
      </View>
  );
}

const styles = StyleSheet.create({
  utilContainer:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'rgba(255,255,255,0.9)'
  }
});
