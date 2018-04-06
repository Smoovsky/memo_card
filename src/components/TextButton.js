import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

export default function TextButton({text, onPress, color,width='30%',fontColor='white',marginHorizontal=0, fontSize=30}){
  const styles = StyleSheet.create({
    button:{
      alignItems: 'center',
      justifyContent:'center',
      borderRadius:10,
      width:width,
      height:50,
      marginTop:5,
      marginHorizontal,
      padding:5
    },
    buttonText:{
      fontSize:fontSize,
      color:fontColor
    }
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, {backgroundColor:color}]}
    >
      <Text style={styles.buttonText}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}
