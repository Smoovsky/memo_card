import React, {Component} from 'react';
import {Text, StyleSheet, TextInput} from 'react-native';
import {connect} from 'react-redux';
import ContainerView from './ContainerView';
import {black, green} from '../utils/colors';
import TextButton from './TextButton';
import { newDeck } from '../actions';

class NewDeck extends Component{
  state = {
    deckName:null
  }
  newDeck = () =>{
    if(typeof(this.state.deckName)==='string'){
      this.props.newDeck(this.state.deckName);
    }
    this.props.navigation.goBack();
  }
  render(){
    return (
      <ContainerView keyboardAvoid={true}>
        <Text style={styles.text}>What is the title of your new deck?</Text>
        <TextInput
          style={styles.textInput}
          value={this.state.deckName}
          onChangeText={deckName => this.setState({deckName})}
        />
        <TextButton
          text={'SUBMIT'}
          color={green}
          onPress={this.newDeck}
          width={'40%'}
        />
      </ContainerView>
    );
  }
}

function mapDispatchToProps(dispatch){
  return {
    newDeck: (deck) => dispatch(newDeck(deck))
  };
}

export default connect(null, mapDispatchToProps)(NewDeck);

const styles = StyleSheet.create({
  text:{
    fontSize:40,
    margin:10,
    textAlign:'center'
  },
  textInput:{
    width:'70%',
    padding:10,
    borderWidth:0.8,
    borderColor:black,
    borderRadius:5
  }
});
