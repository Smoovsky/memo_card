import React, {Component} from 'react';
import {TouchableOpacity, Text, StyleSheet, TextInput} from 'react-native';
import {green} from '../utils/colors';
import {renameDeck, deleteDeck} from '../actions';
import {connect} from 'react-redux';

class DeckUtil extends Component{
  state = {
    mode:'util',
    editDeck:null
  }
  renameDeck = () => {
    this.props.toggleDeckUtilModal();
    return this.props.renameDeck(this.props.target, this.state.editDeck);
  }
  deleteDeck = () => {
    this.props.toggleDeckUtilModal();
    return this.props.deleteDeck(this.props.target);
  }
  util(){
    return (
      <TouchableOpacity style={styles.utilContianer} activeOpacity={1} onPress={this.props.toggleDeckUtilModal}>

        <TouchableOpacity style={styles.util} onPress={()=>{this.setState({mode:'edit'});}}>
          <Text style={styles.utilText}>Edit deck</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.util} onPress={this.deleteDeck}>
          <Text style={styles.utilText}>Delete deck</Text>
        </TouchableOpacity>

      </TouchableOpacity>
    );
  }
  edit(){
    return (
      <TouchableOpacity style={styles.utilContianer} activeOpacity={1} onPress={this.props.toggleDeckUtilModal}>
        <TextInput
          style={[styles.util]}
          onChangeText={editDeck=>this.setState({editDeck})}
          value={this.state.editDeck}
          multiline={true}
        />
        <TouchableOpacity
          style={[styles.button]}
          onPress={this.renameDeck}
        >
          <Text style={styles.buttonText}>
            SUBMIT
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }
  render(){
    return (
      this.state.mode === 'util' ?
        this.util():
        this.edit()
    );
  }
}

const styles = StyleSheet.create({
  utilContianer:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'rgba(255,255,255,0.9)'
  },
  util:{
    width:'90%',
    height:100,
    borderRadius:0,
    marginHorizontal:5,
    marginVertical:0,
    paddingHorizontal:20,
    alignItems: 'center',
    backgroundColor:'#fff',
    borderWidth:1,
    justifyContent:'center'
  },
  utilText:{
    fontSize:30
  },
  button:{
    alignItems: 'center',
    backgroundColor:green,
    justifyContent:'center',
    borderRadius:10,
    width:'30%',
    height:50,
    marginTop:5
  },
  buttonText:{
    fontSize:30,
    color:'white'
  }
});

function mapDispatchToProps(dispatch){
  return {
    renameDeck: (deck, newDeck) => dispatch(renameDeck(deck,newDeck)),
    deleteDeck: (deck) => dispatch(deleteDeck(deck))
  };
}

export default connect(null, mapDispatchToProps)(DeckUtil);
