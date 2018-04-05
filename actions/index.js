import * as api from '../utils/api';

export const NEW_DECK = 'NEW_DECK';
export const GET_DECKS = 'GET_DECKS';
export const NEW_CARD = 'NEW_CARD';
export const DELETE_DECK = 'DELETE_DECK';
export const DELETE_CARD = 'DELETE_DECK';
export const RENAME_DECK = 'RENAME_DECK';
export const EDIT_CARD = 'EDIT_CARD';

export const newDeck = (deck) => {
  let action = {
    type: NEW_DECK
  };
  return (dispatch) => {
    return api.newDeck(deck).then(() => {
      return dispatch({...action, deck});
    });
  };
};

export const getDecks = () => {
  let action = {
    type: GET_DECKS
  };
  return (dispatch) => {
    return api.getDecks().then((decks) => {
      return dispatch({...action, decks});
    });
  };
};

export const newCard = (deck, card) => {
  let action = {
    type: NEW_CARD
  };
  return (dispatch) => {
    return api.newCard(deck, card).then(() => {
      return dispatch({...action, deck, card});
    });
  };
};

export const deleteDeck = (deck) => {
  let action = {
    type: DELETE_DECK
  };
  return (dispatch) => {
    return api.deleteDeck(deck).then(() => {
      return dispatch({...action, deck});
    });
  };
};

export const deleteCard = (deck, card) => {
  let action = {
    type: DELETE_CARD
  };
  return (dispatch) => {
    return api.deleteCard(deck, card).then(() => {
      return dispatch({...action, deck, card});
    });
  };
};

export const renameDeck = (deck, newDeck) => {
  let action = {
    type: RENAME_DECK
  };
  return (dispatch) => {
    return api.renameDeck(deck, newDeck).then(() => {
      return dispatch({...action, deck, newDeck});
    });
  };
};

export const editCard = (deck, card, newCard) => {
  let action = {
    type: EDIT_CARD
  };
  return (dispatch) => {
    return api.editCard(deck, card, newCard).then(() =>{
      return dispatch({...action, deck, card, newCard});
    });
  };
};
