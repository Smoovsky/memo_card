import * as actions from '../actions';

const decks = (
  state = {
    sampleDeck1: {
      title: 'sampleDeck1',
      cards: [
        {
          question: 'sampleQuestion1',
          answer: 'sampleAnswer1'
        },
        {
          question: 'sampleQuestion2',
          answer: 'sampleAnswer12'
        }
      ]
    },
    sampleDeck2: {
      title: 'sampleDeck2',
      cards: [
        {
          question: 'sampleQuestion1',
          answer: 'sampleAnswer1'
        },
        {
          question: 'sampleQuestion2',
          answer: 'sampleAnswer12'
        }
      ]
    }
  },
  action
) => {
  switch (action.type) {
    case actions.NEW_DECK: {
      let { deck } = action;
      // return {...state,
      //   [deck]:
      //       state.deck?state.deck:
      //         {title:deck,
      //           cards:[]
      //         }};
      return {
        ...state,
        [deck]: { title: deck, cards: [] }
      };
    }
    case actions.GET_DECKS: {
      return action.decks;
    }
    case actions.RENAME_DECK: {
      return { ...state }.renameProperty(action.deck, action.newDeck);
    }
    case actions.DELETE_DECK: {
      let nextState = { ...state };
      delete nextState[action.deck];
      return nextState;
    }
    case actions.NEW_CARD: {
      let nextState = { ...state };
      nextState[action.deck].cards.push(action.card);
      return nextState;
    }
    case action.DELETE_CARD: {
      let nextState = { ...state };
      nextState[action.deck].cards = nextState[action.deck].cards.filter(x => {
        return x.question !== action.card;
      });
      return nextState;
    }
    case action.EDIT_CARD: {
      let nextState = { ...state };
      nextState[action.deck].cards = nextState[action.deck].cards.map(
        target =>
          action.card.question === target.question ? action.newCard : target
      );
      return nextState;
    }
    default:
      return state;
  }
};

export default decks;
