import React, {Component} from 'react';
import {connect} from 'react-redux';
import { FlatList, StyleSheet, View, Modal,TouchableOpacity, Text, TextInput } from 'react-native';
import ContainerView from './ContainerView';
import TextButton from './TextButton';
import {black, green} from '../utils/colors';
import {newCard} from '../actions';
import Deck from './Deck';

class DeckDetail extends Component{
  static navigationOptions({navigation}){
    const {params} = navigation.state;
    return {
      title:params ? params : 'deck'
    };
  }
  deck = this.props.deck
  state = {
    modalOpen:false,
    modalMode:null,
    cardQuestionInput:'',
    cardAnswerInput:''
  }
  newCardUtil = () => {
    return (
      <TouchableOpacity style={styles.utilContianer} activeOpacity={1} onPress={this.toggleModal}>
        <TextInput
          style={[styles.util, {height:60, marginBottom:5}] }
          onChangeText={cardQuestionInput=>this.setState({cardQuestionInput})}
          value={this.state.cardQuestionInput}
          multiline={true}
        />
        <TextInput
          style={[styles.util]}
          onChangeText={cardAnswerInput=>this.setState({cardAnswerInput})}
          value={this.state.cardAnswerInput}
          multiline={true}
        />
        <TouchableOpacity
          style={[styles.button]}
          onPress={this.newCard}
        >
          <Text style={styles.buttonText}>
            SUBMIT
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }
  openCardGridModal = () => {
    this.setState({modalOpen:true, modalMode:'grid'});
  }
  openAddCardModal = () => {
    this.setState({modalOpen:true, modalMode:'add'});
  }
  toggleModal = () => {
    this.setState({modalOpen:false});
  }
  newCard = () => {
    if(typeof(this.state.cardQuestionInput) === 'string' && typeof(this.state.cardAnswerInput) === 'string'){
      this.toggleModal();
      this.props.newCard(this.props.deck, {question:this.state.cardQuestionInput, answer:this.state.cardAnswerInput});
      this.setState({cardQuestionInput:'',
        cardAnswerInput:''});
    }

  }
  renderItem = ({item}) => {
    return (<Deck deck={item}/>);
  }
  keyExtractor = (item) => {
    return item;
  }
  cardGrid = () => {
    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        <FlatList
          data={this.props.cards.map(x => x.question)}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
  startQuizz = () => {
    this.props.navigation.push('CardDetail', {deck:this.props.deck});
  }
  render(){
    return (
      <ContainerView>
        <Text style={styles.deckName}>
          {this.deck}
        </Text>
        <Text style={styles.cardCount}>
          {this.props.cards.length+' cards'}
        </Text>
        <View style={styles.buttonContainer}>
          <TextButton text={'View Cards'} color={'rgba(0,0,0,0.1)'} width={'50%'} fontColor={black} onPress={this.openCardGridModal}/>
          <TextButton text={'Add Card'} color={green} width={'50%'} onPress={this.openAddCardModal}/>
          <TextButton text={'Start Quiz'} color={black} width={'50%'} onPress={this.startQuizz}/>
        </View>
        <Modal
          animationType='fade'
          transparent={true}
          visible={this.state.modalOpen}
          onRequestClose={this.toggleModal}
        >
          {this.state.modalMode === 'grid' ? this.cardGrid() : this.newCardUtil()}
        </Modal>
      </ContainerView>
    );
  }
}

const styles = StyleSheet.create({
  deckName:{
    fontSize:40
  },
  cardCount:{
    fontSize:20,
    color:'rgba(0,0,0,0.3)'
  },
  buttonContainer:{
    position:'absolute',
    bottom:50,
    width:'100%',
    alignItems:'center'
  },
  utilContianer:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'rgba(255,255,255,0.9)'
  },
  util:{
    fontSize:20,
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

function mapStateToProps(deck, {navigation}){
  return {cards:deck[navigation.state.params].cards,
    deck:navigation.state.params};
}

function mapDispatchToProps(dispatch){
  return {
    newCard: (deck, card) => dispatch(newCard(deck, card))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DeckDetail);
