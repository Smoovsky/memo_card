import {AsyncStorage} from 'react-native';
import {defaultDeck, DECK_KEY} from './helpers';
import Reactotron from 'reactotron-react-native';

Object.defineProperty(Object.prototype, 'renameProperty', {
  value:function(oldName, newName){
    if (oldName !== newName && !this[newName]) {
      Object.defineProperty(this, newName,
        Object.getOwnPropertyDescriptor(this, oldName));
      delete this[oldName];
    }
    return this;
  },
  enumerable: false
});

export function newDeck(deck){
  return AsyncStorage.getItem(DECK_KEY).then((decks) => {
    if(!decks[deck]){
      return AsyncStorage.mergeItem(DECK_KEY, JSON.stringify(
        {
          [deck]:{
            title:deck,
            cards:[]
          }
        }
      ));
    }
    throw 'duplicated deck';
  }).then((value)=>{Reactotron.log('mergeReturn:', value);});
}

export function getDecks(){
  //AsyncStorage.clear();
  return AsyncStorage.getItem(DECK_KEY).then((decks) => {
    if(decks === null){
      AsyncStorage.setItem(DECK_KEY, JSON.stringify(defaultDeck));
      return defaultDeck;
    }
    //console.log('FOUND');
    return JSON.parse(decks);
  });
}

export function getCardsByDeck(deck){
  return AsyncStorage.getItem(DECK_KEY).then((decks) => {
    decks = JSON.parse(decks);
    return decks[deck];
  });
}

export function newCard(deck, card){
  return AsyncStorage.getItem(DECK_KEY).then((decks) => {
    decks = JSON.parse(decks);
    decks[deck].cards.forEach((element) => {
      if(element.question === card.question){
        throw 'duplicated question';
      }
    });
    decks[deck].cards.push(card);
    return AsyncStorage.setItem(DECK_KEY, JSON.stringify(decks));
  });
}

export function deleteDeck(deck){
  return AsyncStorage.getItem(DECK_KEY).then((decks) => {
    decks = JSON.parse(decks);
    delete decks[deck];
    return AsyncStorage.setItem(DECK_KEY, JSON.stringify(decks));
  });
}

export function deleteCard(deck, card){
  return AsyncStorage.getItem(DECK_KEY).then((decks) => {
    decks = JSON.parse(decks);
    decks.cards = decks[deck].cards.filter(element => element.question !== card);
    return AsyncStorage.setItem(DECK_KEY, JSON.stringify(decks));
  });
}

export function renameDeck(deck, newDeck){
  return AsyncStorage.getItem(DECK_KEY).then((decks) => {
    decks = JSON.parse(decks);
    decks.renameProperty(deck, newDeck);
    return AsyncStorage.setItem(DECK_KEY, JSON.stringify(decks));
  });
}

export function editCard(deck, card, newCard){
  return AsyncStorage.getItem(DECK_KEY).then((decks) => {
    decks = JSON.parse(decks);
    decks[deck].cards = decks[deck].cards.map(target => card.question === target.question ? newCard : target);
    return AsyncStorage.setItem(DECK_KEY, JSON.stringify(decks));
  });
}
