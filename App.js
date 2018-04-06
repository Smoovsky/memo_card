import React from 'react';
import { StyleSheet, View , StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import {applyMiddleware} from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk';
import DeckView from './components/DeckView';
import NewDeck from './components/NewDeck';
import DeckDetail from './components/DeckDetail';
import CardDetail from './components/CardDetail';
import {TabNavigator, StackNavigator} from 'react-navigation';
import {black} from './utils/colors';
import {Constants} from 'expo';
import * as Redux from 'redux';

const store = Redux.createStore(
  reducers,
  applyMiddleware(thunk)
);

function StatusBarCus({backgroundColor, ...props}){
  return (
    <View style={{backgroundColor, height:Constants.statusBarHeight}}>
      <StatusBar translucent {...{backgroundColor}} {...props}/>
    </View>
  );
}

const HomeTab = TabNavigator({
  DeckView:{
    screen:DeckView,
    navigationOptions:{
      tabBarLabel:'Deck'
    }
  },
  NewDeck:{
    screen:NewDeck,
    navigationOptions:{
      tabBarLabel:'New Deck'
    }
  }
},{
  tabBarOptions:{
    style:{
      height:56,
      backgroundColor: black
    }
  }
});

const StackNav = StackNavigator({
  HomeTab:{
    screen:HomeTab,
    navigationOptions:{
      header:null
    }
  },
  DeckDetail:{
    screen:DeckDetail,
    navigationOptions:{
      headerStyle:{
        backgroundColor:black
      },
      headerTitleStyle:{
        color:'white'
      }
    }
  },
  CardDetail:{
    screen:CardDetail,
    navigationOptions:{
      headerStyle:{
        backgroundColor:black
      },
      headerTitleStyle:{
        color:'white'
      }
    }
  }
});

export default class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <View style={{flex:1}}>
          <StatusBarCus backgroundColor={black} barStyle='light-content' />
          <StackNav />
        </View>
      </Provider>
    );
  }
}
