import { AsyncStorage } from 'react-native';
import { defaultDeck, DECK_KEY } from './helpers';
import Reactotron from 'reactotron-react-native';
import { Notifications, Permissions } from 'expo';

const NOTIFICATION_KEY = 'MEMOCARD:NOTIFICATION_KEY';
const PROGRESS_KEY = 'MEMOCARD:PROGRESS_KEY';
const today = (new Date()).toDateString();

Object.defineProperty(Object.prototype, 'renameProperty', {
  value: function(oldName, newName) {
    if (oldName !== newName && !this[newName]) {
      Object.defineProperty(
        this,
        newName,
        Object.getOwnPropertyDescriptor(this, oldName)
      );
      delete this[oldName];
    }
    return this;
  },
  enumerable: false
});

const notificationBody = {
  title: 'Memo card reminder',
  body: 'remember to test yourself today!',
  ios: {
    sound: true
  },
  android: {
    sound: true,
    priority: 'high',
    sticky: false,
    vibrate: true
  }
};

export function checkProgress(decks){
  return AsyncStorage.getItem(PROGRESS_KEY)
    .then(JSON.parse)
    .then((data) => {
      //console.log('progress checked:', data, decks);
      if(data === null || data.date !== today){
        setNotification();
        return AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify({decks, date:today}));
      }
    });
}

export function updateProgress(deck){
  return AsyncStorage.getItem(PROGRESS_KEY)
    .then(JSON.parse)
    .then((data) => {
      if(data !== null && data.decks && data.decks[deck]){
        console.log('progress updated:', deck);
        let newDeck = {...data.decks};
        newDeck[deck].progress = true;
        //console.log(newDeck);
        return AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify({decks:newDeck, date:today}));
      }
    });
}

export function checkCompletion(){
  return AsyncStorage.getItem(PROGRESS_KEY)
    .then(JSON.parse)
    .then((data) => {
      let result = true;
      //console.log(data.decks);
      for (let x in data.decks){
        //console.log('checking',x);
        if(!data.decks[x].progress){
          result = false;
          break;
        }
      }
      if(result){
        clearNotification()
          .then(setNotification);
      }
    });
}

export function setNotification() {
  console.log('set');
  return AsyncStorage.getItem(NOTIFICATION_KEY)
    .then(data => {
      //console.log(data);
      return JSON.parse(data);
    })
    .then(data => {
      if (data === null) {
        Permissions.askAsync(Permissions.NOTIFICATIONS).then(({ status }) => {
          if (status === 'granted') {
            Notifications.cancelAllScheduledNotificationsAsync();
            let tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(18);
            tomorrow.setMinutes(0);
            Notifications.scheduleLocalNotificationAsync(notificationBody, {
              time: tomorrow,
              repeat: 'day'
            });
          }
        });
      }
    });
}

export function clearNotification() {
  console.log('clear');
  return AsyncStorage.removeItem(NOTIFICATION_KEY).then(
    Notifications.cancelAllScheduledNotificationsAsync
  );
}

export function newDeck(deck) {
  return AsyncStorage.getItem(DECK_KEY)
    .then(decks => {
      if (!decks[deck]) {
        return AsyncStorage.mergeItem(
          DECK_KEY,
          JSON.stringify({
            [deck]: {
              title: deck,
              cards: []
            }
          })
        );
      }
      throw 'duplicated deck';
    })
    .then(value => {
      Reactotron.log('mergeReturn:', value);
    });
}

export function getDecks() {
  //AsyncStorage.clear();
  return AsyncStorage.getItem(DECK_KEY).then(decks => {
    if (decks === null) {
      AsyncStorage.setItem(DECK_KEY, JSON.stringify(defaultDeck));
      return defaultDeck;
    }
    //console.log('FOUND');
    return JSON.parse(decks);
  });
}

export function getCardsByDeck(deck) {
  return AsyncStorage.getItem(DECK_KEY).then(decks => {
    decks = JSON.parse(decks);
    return decks[deck];
  });
}

export function newCard(deck, card) {
  return AsyncStorage.getItem(DECK_KEY).then(decks => {
    decks = JSON.parse(decks);
    decks[deck].cards.forEach(element => {
      if (element.question === card.question) {
        throw 'duplicated question';
      }
    });
    decks[deck].cards.push(card);
    return AsyncStorage.setItem(DECK_KEY, JSON.stringify(decks));
  });
}

export function deleteDeck(deck) {
  return AsyncStorage.getItem(DECK_KEY).then(decks => {
    decks = JSON.parse(decks);
    delete decks[deck];
    return AsyncStorage.setItem(DECK_KEY, JSON.stringify(decks));
  });
}

export function deleteCard(deck, card) {
  return AsyncStorage.getItem(DECK_KEY).then(decks => {
    decks = JSON.parse(decks);
    decks.cards = decks[deck].cards.filter(
      element => element.question !== card
    );
    return AsyncStorage.setItem(DECK_KEY, JSON.stringify(decks));
  });
}

export function renameDeck(deck, newDeck) {
  return AsyncStorage.getItem(DECK_KEY).then(decks => {
    decks = JSON.parse(decks);
    decks.renameProperty(deck, newDeck);
    return AsyncStorage.setItem(DECK_KEY, JSON.stringify(decks));
  });
}

export function editCard(deck, card, newCard) {
  return AsyncStorage.getItem(DECK_KEY).then(decks => {
    decks = JSON.parse(decks);
    decks[deck].cards = decks[deck].cards.map(
      target => (card.question === target.question ? newCard : target)
    );
    return AsyncStorage.setItem(DECK_KEY, JSON.stringify(decks));
  });
}
