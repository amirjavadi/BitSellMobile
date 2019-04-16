import React from 'react';
import {Dimensions, Image, Animated, Easing, StatusBar, TouchableOpacity, Platform, StyleSheet, AsyncStorage, NetInfo} from 'react-native';
import {Body, Button, Icon, Left, Right, Text, View} from 'native-base';
import {Actions} from 'react-native-router-flux';
import Login1Style from '../assets/styles/Login1';
import {DotIndicator} from 'react-native-indicators';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import api from '../api';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

export default class Splash extends React.Component{

  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(0);
    this.animatedValue1 = new Animated.Value(0);
    this.animatedValue2 = new Animated.Value(0);
    this.animatedValue3 = new Animated.Value(0);
    this.animatedValue4 = new Animated.Value(0);
    this.state= {
      online: undefined,
      appVersion: '',
      model: '',
      uniqueId: '',
      company: '',
      osVersion: '',
      OS: '',
      location: '',
      timer: 1000,
      status: '',
    }
  }

  async componentDidMount() {
    await AsyncStorage.getItem('firstTime').then((result) => {
      if (result === null) {
        this.setState({status: 1});
        AsyncStorage.setItem('firstTime', JSON.stringify(1));
      } else if (result === '1') {
        this.setState({status: 3});
        AsyncStorage.setItem('firstTime', JSON.stringify(1));
      }
    });
    this.splash();
  }

  splash() {
    AsyncStorage.getItem('login').then(res => {
      if (res === 'true') {
        this.animate();
        setTimeout(() => {
          this.animate1()
        }, 300);
        setTimeout(() => {
          this.animate2()
        }, 1000);
        setTimeout(() => {
          this.sendData();
        }, 500);
        setTimeout(() => {
          this._checkNetwork()
        }, 2000);
      } else if (res === null || res === 'false') {
        this.animate();
        setTimeout(() => {
          this.animate1()
        }, 300);
        setTimeout(() => {
          this.animate2()
        }, 1000);
        setTimeout(() => {
          this.sendData();
        }, 500);
        setTimeout(() => {
          this.animate3()
        }, 1550);
        setTimeout(() => {
          this.animate4()
        }, 2000);
      }
  })}

  sendData() {
    let systemVersion = DeviceInfo.getSystemVersion();
    let getManufacturer = DeviceInfo.getManufacturer();
    let getUniqueID = DeviceInfo.getUniqueID();
    let getModel = DeviceInfo.getModel();
    let getVersion = DeviceInfo.getVersion();
    this.setState({appVersion: getVersion, model: getModel, uniqueId: getUniqueID, company: getManufacturer, osVersion: systemVersion, OS: Platform.OS});
    navigator.geolocation.getCurrentPosition((position) => this.setState({location: `POINT ${position.coords.latitude} ${position.coords.longitude}`}));
    let data = {
      appVersion: this.state.appVersion,
      Device: this.state.model,
      IMEI: this.state.uniqueId,
      company: this.state.company,
      osVersion: this.state.osVersion,
      OS: this.state.OS,
      geometryString: this.state.location,
      Status: this.state.status,
    };
    console.log(5, this.state.status);
    let headers = {
      'Content-Type': 'application/json',
    };
    console.log(JSON.stringify(data));
    axios.post(api.url + '/api/LogApp/AddLogApp', JSON.stringify(data), {headers: headers})
      .then((response) => {
        // i dont know
      })
      .catch((error) => console.info(error));
  }

  async _checkNetwork() {
    await NetInfo.isConnected.fetch().then((isConnected) => {
      this.setState({online: isConnected}, () => {
        if (isConnected === true) {
          Actions.reset('tabBar')
        } else {
          this.setState({online: false})
        }
      });
    });
  }

  _refresh() {
    this.setState({online: true});
    this._checkNetwork();
  }

  animate(){
    this.animatedValue.setValue(0);
    Animated.timing(this.animatedValue,{
      toValue: 1,
      duration: 500,
      easing : Easing.linear
    }).start()
  }

  animate1(){
    this.animatedValue1.setValue(0);
    Animated.timing(this.animatedValue1,{
      toValue: 1,
      duration: 500,
      easing : Easing.linear
    }).start()
  }

  animate2(){
    this.animatedValue2.setValue(0);
    Animated.timing(this.animatedValue2,{
      toValue: 1,
      duration: 500,
      easing : Easing.linear
    }).start()
  }

  animate3(){
    this.animatedValue3.setValue(0);
    Animated.timing(this.animatedValue3,{
      toValue: 1,
      duration: 300,
      easing : Easing.linear
    }).start()
  }

  animate4(){
    this.animatedValue4.setValue(0);
    Animated.timing(this.animatedValue4,{
      toValue: 1,
      duration: 500,
      easing : Easing.linear
    }).start()
  }

  check1() {
    if (Actions.currentScene === 'login2'){
    } else {
      Actions.login2()
    }
  }

  check2() {
    if (Actions.currentScene === 'reg'){
    } else {
      Actions.reg()
    }
  }

  render(){
    const right = this.animatedValue.interpolate({
      inputRange:[0,1],
      outputRange:[-deviceWidth, deviceWidth / 2 - 120]
    });
    const left = this.animatedValue1.interpolate({
      inputRange:[0,1],
      outputRange:[-deviceWidth, deviceWidth / 2 - 75]
    });
    const width = this.animatedValue2.interpolate({
      inputRange:[0,0.5,1],
      outputRange:[0, 270, 250]
    });
    const top = this.animatedValue3.interpolate({
      inputRange:[0,1],
      outputRange:[0, -deviceHeight / 4]
    });
    const opacity = this.animatedValue4.interpolate({
      inputRange:[0,1],
      outputRange:[0, 1]
    });
    return(
      <View style={{flex: 1, width: deviceWidth, height: deviceHeight - 25, justifyContent: 'center', alignItems: 'center'}}>
        <StatusBar
          backgroundColor="#404e67"
          barStyle="light-content"
        />
        <Image style={{flex: 1, width: deviceWidth, height: deviceHeight - 25, resizeMode: 'cover', zIndex: 1}} source={require('./../pictures/background.png')}/>
        <Animated.View style={{top, flex: 1, width: deviceWidth, height: deviceHeight - 25, position: 'absolute', zIndex: 5, justifyContent: 'center', alignItems: 'center'}}>
          <Animated.Image source={require('./../pictures/B1.png')} style={{width: 150, resizeMode: 'contain', position: 'absolute', right, zIndex: 5}}/>
          <Animated.Image source={require('./../pictures/S1.png')} style={{width: 70, resizeMode: 'contain', position: 'absolute', left, zIndex: 4}}/>
          <Animated.Image source={require('./../pictures/Circle.png')} style={{width, resizeMode: 'contain',position: 'absolute', zIndex: 3}}/>
        </Animated.View>
        {this.state.online === true && <DotIndicator size={5} color="white" count={5} style={{position: 'absolute', alignSelf: 'center', justifyContent: 'center', zIndex: 5, bottom: deviceHeight / 4}}/>}
        {this.state.online === false &&
        <View style={{position: 'absolute', zIndex: 5, bottom: deviceHeight / 5}}>
          <Text style={{fontFamily: 'Vazir-FD', fontSize: 14, textAlign: 'center', color: 'white'}}>دسترسی به اینترنت ممکن نیست</Text>
          <Button transparent={true} style={{height: 30, borderWidth: 1, borderColor: 'white', borderRadius: 5, display: 'flex', alignSelf: 'center', marginTop: 25}} onPress={() => this._refresh()}>
            <Text style={{fontFamily: 'Vazir-FD', fontSize: 12, color: 'white', textAlign: 'center', height: 25}}>تلاش مجدد</Text>
          </Button>
        </View>}
        <Animated.View style={{position: 'absolute', opacity, zIndex: 6, height: deviceHeight / 8 + 15, bottom: deviceHeight / 18, alignItems: 'center', justifyContent: 'space-around'}}>
          <TouchableOpacity activeOpacity={0.7} style={style.fBTN} onPress={() => this.check1()}>
            <Icon type="MaterialCommunityIcons" name="lock-open" style={style.icon}/>
            <Text style={style.text}>ورود</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} style={style.sBTN} onPress={() => this.check2()}>
            <Icon type="MaterialCommunityIcons" name="account-plus" style={[style.icon, {color: '#404e67'}]}/>
            <Text style={[style.text, {color: '#404e67'}]}>عضویت</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    )
  }
}

const style = StyleSheet.create({
  fBTN: {
    width: deviceWidth * 8 / 10,
    height: deviceHeight / 18,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
    marginHorizontal: 5,
    color: 'white',
  },
  text: {
    ...Platform.select({
      ios: {
        fontFamily: 'Vazir-FD',
        fontWeight: 'bold',
        textAlign: 'center'
      },
      android: {
        textAlign: 'center',
        fontFamily: 'Vazir-Bold-FD',
      }
    }),
    fontSize: 14,
    color: 'white',
  },
  sBTN: {
    width: deviceWidth * 8 / 10,
    height: deviceHeight / 17,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  }
});
