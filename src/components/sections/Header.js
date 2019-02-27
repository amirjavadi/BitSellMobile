import React from 'react';
import {View, Left, Right, Body, Text, Button, Icon} from 'native-base';
import HeaderStyle from './../../assets/styles/Header';
import {Actions} from 'react-native-router-flux';
import {Platform} from 'react-native';

export default class Header extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      empty: ''
    }
  }

  check(){
    if (Actions.currentScene === 'cart'){

    } else {
      Actions.cart()
    }
  }

  render(){
    return(
      <View style={HeaderStyle.main}>
        <Left>
          {this.props.name === 'خانه' ? <Text style={{...Platform.select({
              ios: {
                fontFamily: 'Vazir-FD',
                fontWeight: 'bold',
                textAlign: 'center'
              },
              android: {
                textAlign: 'center',
                fontFamily: 'Vazir-Bold-FD',
              }
            }), fontSize: 16, color: 'white', marginHorizontal: 20}}>BITSELL</Text> : <Button transparent={true} onPress={() => Actions.pop()}><Icon name="arrow-forward" ios="ios-arrow-forward" android="md-arrow-forward" style={{color: 'white', fontSize: 22}}/></Button>}
        </Left>
        <Body>{this.props.name !== 'خانه' && <Text style={[HeaderStyle.title, {fontSize: this.props.name.length > 14 ? 10 : 15}]}>{this.props.name}</Text>}</Body>
        <Right style={HeaderStyle.right}>
          <Button transparent={true} onPress={() => this.props.screen === 'cart' ? {} : this.check()}><Icon name="cart" ios="ios-cart" android="md-cart" style={HeaderStyle.cartButton}/></Button>
        </Right>
      </View>
    )
  }
}
