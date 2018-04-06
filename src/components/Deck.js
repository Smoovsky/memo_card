import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

export default function Deck({deck, deckUtil, navigation}){
  let onPress = () => {
    navigation.navigate({routeName:'DeckDetail', params:deck});
  };
  return (
    deckUtil ? <TouchableOpacity style={styles.deck} onLongPress={()=>{deckUtil(deck);}} onPress={onPress}>
      <Text style={styles.deckText}>{deck}</Text>
    </TouchableOpacity> : <TouchableOpacity style={styles.deck} >
      <Text style={styles.deckText}>{deck}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  deck:{
    width:'90%',
    height:100,
    borderRadius:10,
    marginHorizontal:5,
    marginVertical:5,
    paddingHorizontal:20,
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor:'#fff',
    elevation: 5,
    alignSelf:'center'
  },
  deckText:{
    fontSize:30
  }
});
