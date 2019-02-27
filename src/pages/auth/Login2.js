import React from 'react';
import {Dimensions, Image, Platform, StatusBar, TouchableOpacity, Keyboard, AsyncStorage, NetInfo} from 'react-native';
import {View, Text, Container, Content, Icon, Input} from 'native-base';
import LinearGradient from "react-native-linear-gradient";
import Login2Style from './../../assets/styles/Login2';
import axios from 'axios';
import api from '../../api';
import {Actions} from 'react-native-router-flux';
import {DotIndicator} from 'react-native-indicators';
import {decode, encode} from 'base-64'

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

export default class Login2 extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      hiddenUI: false,
      userName: '',
      password: '',
      recordErrors: {},
      notRegistered: false,
      userLocked: false,
      loader: false,
      disabled: false,
      online: true,
    };
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow() {
    this.setState({hiddenUI: true});
  }

  _keyboardDidHide() {
    this.setState({hiddenUI: false});
  }

  change(name, text) {
    let persian = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    let english = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    this.setState({loader: false, disabled: false, notRegistered: false, userLocked: false, recordErrors: {}});
    switch (name) {
      case 'userName':
        let userName = text;
        for (let i = 0; i < 10; i++) {
          userName = userName.toString().replace(persian[i], english[i]);
        }
        this.setState({userName: userName});
        break;
      case 'password':
        let password = text;
        for (let i = 0; i < 10; i++) {
          password = password.toString().replace(persian[i], english[i]);
        }
        this.setState({password: password});
        break;
    }
  }

  checkValidation(rcallback) {
    let recordFormIsValid = true;
    let recordErrors = {};
    let regex = RegExp('^(09)\\d{9}$');
    //mobile
    if (!regex.test(this.state.userName)) {
      recordFormIsValid = false;
      recordErrors['userName'] = 'شماره موبایل اشتباه است.'
    }
    this.setState({recordErrors}, () => {
      return rcallback(recordFormIsValid)
    })
  }

  async _checkNetwork() {
    await NetInfo.isConnected.fetch().then((isConnected) => {
      this.setState({online: isConnected}, () => {
        if (isConnected === true) {
          this.login();
        } else {
          this.setState({online: false, disabled: false, loader: false})
        }
      });
    });
  }

  login() {
    this.setState({disabled: true, loader: true});
    let ISO = this.state.userName + ':' + this.state.password;
    if (!global.btoa) {
      global.btoa = encode;
    }
    let headers = {
      'Authorization': 'Basic ' + btoa(ISO),
    };
    this.checkValidation((valid) => {
      if (valid) {
        axios.post(api.url + '/api/Customer/Login', {}, {headers: headers})
          .then((response) => {
            this.setStorageData(response);
          })
          .catch(() => {
            console.info('Error')
          })
      } else {
        this.setState({disabled: false, loader: false});
      }
    })
  }

  async setStorageData(response) {
    let ISO = this.state.userName + ':' + this.state.password;
    if (response.data === '<p>User not Authorication</p>') {
      await this.setState({disabled: false, loader: false, notRegistered: true})
    } else if (response.data.lock === false) {
      await this.setState({disabled: false, loader: false, userLocked: true})
    } else if (response.data.lock === true) {
      await AsyncStorage.setItem('user', JSON.stringify(response.data));
      await AsyncStorage.setItem('pass', this.state.password);
      await AsyncStorage.setItem('data', JSON.stringify(ISO));
      await AsyncStorage.setItem('login', JSON.stringify(true));
      Actions.reset('tabBar');
    }
  }

  forgetPass() {
    if (Actions.currentScene === 'forgetPass') {

    } else {
      Actions.forgetPass();
    }
  }

  render(){
    let {recordErrors} = this.state;
    return(
      <Container>
        <StatusBar
          backgroundColor="#404e67"
          barStyle="light-content"
        />
        <Content>
          <Image style={[Login2Style.background, {height: this.state.hiddenUI ? deviceHeight - deviceHeight / 4 + 40 : deviceHeight - 25}]} source={require('./../../pictures/background-white.png')}/>
          <View style={[Login2Style.floatView, {height: this.state.hiddenUI ? deviceHeight / 2 : deviceHeight}]}>
            <Image source={require('./../../pictures/bitsell-logo-noshadow.png')} style={Login2Style.logo}/>
            <View style={{alignItems: 'center', marginBottom: 50}}>
              <Text style={{display: recordErrors['userName'] ? 'flex' : 'none', fontSize: 12, fontFamily: 'Vazir-FD', color: 'red', marginLeft: 20}}>{recordErrors['userName']}</Text>
              <Text style={{display: this.state.notRegistered ? 'flex' : 'none', fontSize: 12, fontFamily: 'Vazir-FD', color: 'red', marginLeft: 20}}>این نام کاربری ثبت نام نشده است.لطفا ابتدا ثبت نام کنید.</Text>
              <Text style={{display: this.state.userLocked ? 'flex' : 'none', fontSize: 12, fontFamily: 'Vazir-FD', color: 'red', marginLeft: 20}}>این نام کاربری قفل شده است.</Text>
              <Text style={{display: this.state.online ? 'none' : 'flex', fontSize: 12, fontFamily: 'Vazir-FD', color: 'red', marginLeft: 20}}>اتصال به اینترنت برقرار نیست.</Text>
              <View style={[Login2Style.linear, Login2Style.two]}>
                <Icon type="MaterialCommunityIcons" name="account" style={Login2Style.icon1}/>
                <Input maxLength={11} placeholder="نام کاربری" keyboardType="numeric" style={[Login2Style.userInput, {height: 38, borderRadius: 14, backgroundColor: 'transparent'}]} onChangeText={(text) => this.change('userName', text)}/>
              </View>
              <View style={[Login2Style.linear, Login2Style.two]}>
                <Icon type="MaterialCommunityIcons" name="lock-open" style={Login2Style.icon1}/>
                <Input  secureTextEntry={true} placeholder="رمز" style={[Login2Style.userInput, {height: 38, borderRadius: 14, backgroundColor: 'transparent'}]} onChangeText={(text) => this.change('password', text)}/>
              </View>
              <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={!this.state.disabled ? ['#148e91', '#2a6e85', '#3b527b'] : ['#cccccc', '#cccccc', '#cccccc']} style={Login2Style.linear1}>
                <TouchableOpacity activeOpacity={0.5} style={Login2Style.loginBTN} onPress={() => this._checkNetwork()} disabled={this.state.disabled}>
                  {!this.state.loader && <Text style={Login2Style.text}>ورود</Text>}
                  {this.state.loader && <DotIndicator size={5} color="#148E91" count={5} />}
                </TouchableOpacity>
              </LinearGradient>
              <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={!this.state.disabled ? ['#148e91', '#2a6e85', '#3b527b'] : ['#cccccc', '#cccccc', '#cccccc']} style={[Login2Style.linear1, {marginTop: 10}]}>
                <TouchableOpacity activeOpacity={0.5} style={Login2Style.loginBTN} onPress={() => this.forgetPass()} disabled={this.state.disabled}>
                  <Text style={[Login2Style.text, {fontSize: 12, color: this.state.disabled ? '#3B527B' : 'white'}]}>فراموشی رمز عبور</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </Content>
      </Container>
    )
  }
}
