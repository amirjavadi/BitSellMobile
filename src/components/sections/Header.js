import React from 'react';
import {View, Left, Right, Body, Text, Button, Icon} from 'native-base';
import HeaderStyle from './../../assets/styles/Header';
import {Actions} from 'react-native-router-flux';
import {AsyncStorage, Platform} from 'react-native';
import {removeCart, removeHoleCart} from '../../redux/actions';
import {connect} from 'react-redux';
import {encode} from 'base-64';
import axios from 'axios';
import api from '../../api';
import PushNotification from 'react-native-push-notification';
import PushController from '../PushController';

class Header extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      empty: '',
      ISO: '',
      notifLength: '',
      time: '',
    }
  }

  check(){
    if (Actions.currentScene === 'cart'){

    } else {
      Actions.cart()
    }
  }

  async componentDidMount() {
    console.log(Actions.currentScene);
    await AsyncStorage.getItem('data').then(res => {
      let response = JSON.parse(res);
      this.setState({ISO: response})
    });
    await AsyncStorage.getItem('date').then(res1 => {
      if (res1 === null || res1 === undefined) {
        this.setState({time: new Date().toISOString()});
        console.log(2, this.state.time);
      } else {
        console.log(res1);
        let response1 = JSON.parse(res1);
        this.setState({time: response1});
        console.log(3, this.state.time);
      }
    });
    if (this.props.currentScene === 'brands') {
      this.getNotification();
    } else {
      AsyncStorage.getItem('notifLength')
        .then((res) => this.setState({notifLength: res}))
    }
  }

  getNotification() {
    if (!global.btoa) {
      global.btoa = encode;
    }
    let headers = {
      'Authorization': 'Basic ' + btoa(this.state.ISO),
    };
    axios.get(api.url + '/api/Notification/GetNotifications?dateTime=' + this.state.time, {headers: headers})
      .then(async (response) => {
        await console.log(4, response);
        await this.setState({notifLength: response.data.length});
        await AsyncStorage.setItem('date', JSON.stringify(this.state.time));
        await AsyncStorage.setItem('notifLength', JSON.stringify(this.state.notifLength));

        if (response.data.length > 0) {
          this.showNotification();
        }
      })
      .catch((error) => console.log(2, error));
  }

  showNotification() {
    PushNotification.localNotification({
      title: `شما پیام جدید دارید.`,
      message: `لطفا به قسمت پیام ها در برنامه مراجعه کنید.`,
    });
  }
  render(){
    return(
      <View style={HeaderStyle.main}>
        <PushController/>
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
            }), fontSize: 16, color: 'white', marginHorizontal: 10}}>BITSELL</Text> : <Button transparent={true} onPress={() => Actions.pop()}><Icon name="arrow-forward" ios="ios-arrow-forward" android="md-arrow-forward" style={{color: 'white', fontSize: 22}}/></Button>}
        </Left>
        <Body>{this.props.name !== 'خانه' && <Text numberOfLines={1} style={[HeaderStyle.title, {fontSize: this.props.name.length > 14 ? 10 : 14, textAlign: 'center', justifyContent: 'center', alignItems: 'center'}]}>{this.props.name}</Text>}</Body>
        <Right style={HeaderStyle.right}>
          <Button transparent={true} onPress={() => {}}>
            <Icon name="bell" type="MaterialCommunityIcons" style={HeaderStyle.bellButton} />
            <View style={{position: 'absolute', top: 5, left: 5, borderWidth: 2, borderColor: '#404e67', borderRadius: 200}}>
              {this.state.notifLength > 0 && <Text style={[HeaderStyle.title, {width: 17, height: 17, fontSize: 10, backgroundColor: '#404e67', borderWidth: 1, borderColor: 'white', borderRadius: 200, textAlign: 'center', zIndex: 2, paddingRight: 0, paddingLeft: 0, paddingTop: 0, paddingBottom: 0, alignItems: 'center', justifyContent: 'center'}]}>{this.state.notifLength <= 9 ? this.state.notifLength : '9+'}</Text>}
            </View>
          </Button>
          <Button transparent={true} onPress={() => this.props.screen === 'cart' ? {} : this.check()}>
            <Icon name="cart" ios="ios-cart" android="md-cart" style={HeaderStyle.cartButton}/>
            <View style={{position: 'absolute', top: 5, left: 5, borderWidth: 2, borderColor: '#404e67', borderRadius: 200}}>
              {this.props.cart.length !== 0 && <Text style={[HeaderStyle.title, {width: 17, height: 17, fontSize: 10, backgroundColor: '#404e67', borderWidth: 1, borderColor: 'white', borderRadius: 200, textAlign: 'center', zIndex: 2, paddingRight: 0, paddingLeft: 0, paddingTop: 0, paddingBottom: 0, alignItems: 'center', justifyContent: 'center'}]}>{this.props.cart.length <= 9 ? this.props.cart.length : '9+'}</Text>}
            </View>
          </Button>
        </Right>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    cart: state.cart,
  };
};

export default connect(
  mapStateToProps,
  null,
)(Header);
