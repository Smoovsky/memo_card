import React, {Component} from 'react';
import {connect} from 'react-redux';
import { FlatList, StyleSheet, View, Modal } from 'react-native';
import {getDecks, newDeck, renameDeck, deleteDeck} from '../actions';
import Deck from './Deck';
import DeckUtil from './DeckUtil';
import {checkProgress} from '../utils/api';


class DeckView extends Component{
  state = {
    decks:{},
    ready:false,
    deckUtilModalOpen:false,
    utilTarget:null
  }
  toggleDeckUtilModal = () => {
    this.setState({deckUtilModalOpen:!this.state.deckUtilModalOpen});
  }
  deckUtil = (target) => {
    this.toggleDeckUtilModal();
    this.setState({utilTarget:target});
  }
  onPressDeck = () => {
    alert('long press detected');
  }
  componentDidMount(){
    this.props.getDecks().then(this.setState({ready:true}));
    console.log(23);
    checkProgress(this.props.decks);
  }
  renderItem = ({item}) => {
    return (<Deck deck={item} onPress={this.onPressDeck} deckUtil={this.deckUtil}
      navigation={this.props.navigation}/>);
  }

  keyExtractor = (item) => {
    return item;
  }
  render(){
    return (
      <View style={styles.deckView}>
        <FlatList
          data={Object.keys(this.props.decks)}
          keyExtractor = {this.keyExtractor}
          renderItem = {this.renderItem}
        />
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.deckUtilModalOpen}
          onRequestClose={this.toggleDeckUtilModal}
        >
          <DeckUtil
            target={this.state.utilTarget}
            toggleDeckUtilModal={this.toggleDeckUtilModal}/>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  deckView:{
    flex:1,
    alignItems:'stretch',
  }
});

function mapStateToProps(decks){
  return {decks};
}

function mapDispatchToProps(dispatch){
  return {
    getDecks: () => dispatch(getDecks()),
    newDeck: (deck) => dispatch(newDeck(deck)),
    renameDeck: (deck, newDeck) => dispatch(renameDeck(deck, newDeck)),
    deleteDeck: (deck) => dispatch(deleteDeck(deck))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DeckView);
