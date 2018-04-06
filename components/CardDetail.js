import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextButton from './TextButton';
import { View, Animated, Text, StyleSheet, BackHandler, AsyncStorage } from 'react-native';
import ContainerView from './ContainerView';
import { black, green, red } from '../utils/colors';
import {updateProgress, checkCompletion} from '../utils/api';

class CardDetail extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      title: params.card ? params.card + '/' + params.length : 'Cards'
    };
  };

  state = {
    currentQuestion: 0,
    currentScore: 0,
    currentView: 'question',
    flipAngle: new Animated.Value(0),
    result: Array(),
    resultReached: false
  };
  card = this.props.cards;
  componentDidMount() {
    this.props.navigation.setParams({
      card: (this.state.currentQuestion + 1).toString(),
      length: this.props.cards.length.toString()
    });
    BackHandler.addEventListener('hardwareBackPress', this.handleBack);
  }
  handleBack = () => {
    if (this.state.currentView === 'answer') {
      this.onFlip();
      return true;
    } else if (
      this.state.currentQuestion === 0 ||
      this.state.resultReached === true
    ) {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
      return false;
    } else if (this.state.currentView === 'question') {
      this.prevQuestion();
      return true;
    }

    return false;
  };
  onCorrect = () => {
    let { result } = this.state;
    result[this.state.currentQuestion] = true;
    this.setState({ result });
    this.nextQuestion();
  };
  onWrong = () => {
    let { result } = this.state;
    result[this.state.currentQuestion] = false;
    this.setState({ result });
    this.nextQuestion();
  };
  prevQuestion = () => {
    let { currentQuestion } = this.state;
    this.setState(
      { currentQuestion: currentQuestion === 0 ? 0 : currentQuestion - 1 },
      () => {
        this.props.navigation.setParams({
          card: (this.state.currentQuestion + 1).toString()
        });
      }
    );
    this.setState({ currentView: 'question' });
  };
  nextQuestion = () => {
    let { currentQuestion } = this.state;
    this.setState(
      {
        currentQuestion:
          currentQuestion === this.props.cards.length - 1
            ? currentQuestion
            : currentQuestion + 1
      },
      () => {
        if(!this.state.resultReached){
          this.props.navigation.setParams({
            card: (this.state.currentQuestion + 1).toString()
          });}
      }
    );
    this.setState({ currentView: 'question' });

    if (currentQuestion === this.props.cards.length - 1) {
      this.setState({ resultReached: true });
    }
  };
  onFlip = () => {
    let done = false;
    this.state.flipAngle.addListener(({ value }) => {
      if (done === false && value > 85 && value < 95) {
        this.setState({
          currentView:
            this.state.currentView === 'question' ? 'answer' : 'question'
        });
      }
    });
    Animated.timing(this.state.flipAngle, {
      toValue: 180,
      duration: 500
    }).start(() => {
      this.setState({ flipAngle: new Animated.Value(0) });
    });
  };

  questionView = () => {
    return (
      <React.Fragment>
        <Text style={styles.questionText}>
          {this.props.cards[this.state.currentQuestion].question}
        </Text>
        <View style={styles.flipButton}>
          <TextButton text={'FLIP'} color={black} onPress={this.onFlip} />
        </View>
        <View style={styles.navButton}>
          <TextButton
            text={'Previous'}
            color={black}
            marginHorizontal={20}
            fontSize={20}
            onPress={this.prevQuestion}
          />
          <TextButton
            text={'Next'}
            color={black}
            marginHorizontal={20}
            fontSize={20}
            onPress={this.nextQuestion}
          />
        </View>
      </React.Fragment>
    );
  };
  answerView = () => {
    return (
      <React.Fragment>
        <Text style={styles.questionText}>
          {this.props.cards[this.state.currentQuestion].answer}
        </Text>
        <View style={styles.flipButton}>
          <TextButton
            text={'Correct'}
            color={green}
            width={'40%'}
            onPress={this.onCorrect}
          />
          <TextButton
            text={'Wrong'}
            color={red}
            onPress={this.onWrong}
            width={'40%'}
          />
        </View>
        <View style={styles.navButton}>
          <TextButton
            text={'Previous'}
            fontSize={20}
            color={black}
            marginHorizontal={20}
            onPress={this.prevQuestion}
          />
          <TextButton
            text={'Next'}
            color={black}
            fontSize={20}
            marginHorizontal={20}
            onPress={this.nextQuestion}
          />
        </View>
      </React.Fragment>
    );
  };
  resultView = () => {
    console.log('result');
    let result = 0;
    this.state.result.forEach(x => {
      if (x === true) result++;
    });
    updateProgress(this.props.deck).then(checkCompletion);
    return (
      <ContainerView>
        <Text style={styles.questionText}>You scored:{' ' + result}</Text>
      </ContainerView>
    );
  };
  render() {
    //console.log(this.props.cards);
    let flipAngle = this.state.flipAngle.interpolate({
      inputRange: [0, 90, 90.1, 180],
      outputRange: ['0deg', '90deg', '-90deg', '0deg']
    });
    if (this.props.cards.length > 0) {
      return this.state.resultReached === false ? (
        <Animated.View
          style={[styles.container, { transform: [{ rotateY: flipAngle }] }]}
        >
          {this.state.currentView === 'question'
            ? this.questionView()
            : this.answerView()}
        </Animated.View>
      ) : (
        this.resultView()
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)'
  },
  questionText: {
    fontSize: 30
  },
  flipButton: {
    marginTop: 60,
    width: '100%',
    alignItems: 'center'
  },
  navButton: {
    position: 'absolute',
    bottom: 25,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

function mapStateToProps(deck, { navigation }) {
  return {
    cards: deck[navigation.state.params.deck].cards,
    deck: navigation.state.params.deck
  };
}

export default connect(mapStateToProps, null)(CardDetail);
