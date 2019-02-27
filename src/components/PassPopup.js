import React from 'react';
import {Icon, Input, Text, View} from 'native-base';
import {AsyncStorage, TouchableOpacity} from 'react-native';
import BaseLightbox from './lightbox/BaseLightbox';
import LinearGradient from "react-native-linear-gradient";
import PassPopup from './../assets/styles/PassPopup';
import axios from 'axios';
import api from '../api';
import {encode} from 'base-64';
import Login2Style from '../assets/styles/Login2';
import DotIndicator from 'react-native-indicators/src/components/dot-indicator';
import {Actions} from 'react-native-router-flux';

export default class Popup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      oldPassword: '',
      newPassword1: '',
      newPassword2: '',
      equal: true,
      ISO: '',
      disabled: false,
      loader: false,
    }
  }

  async componentDidMount() {
    await AsyncStorage.getItem('pass').then(res => {
      this.setState({oldPassword: res});
    });
  }

  change(name, text) {
    let persian = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    let english = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    this.setState({equal: true});
    switch (name) {
      case 'oldPassword':
        let oldPassword = text;
        for (let i = 0; i < 10; i++) {
          oldPassword = oldPassword.toString().replace(persian[i], english[i]);
        }
        this.setState({oldPassword: oldPassword});
        break;
      case 'newPassword1':
        let newPassword1 = text;
        for (let i = 0; i < 10; i++) {
          newPassword1 = newPassword1.toString().replace(persian[i], english[i]);
        }
        this.setState({newPassword1: newPassword1});
        break;
      case 'newPassword2':
        let newPassword2 = text;
        for (let i = 0; i < 10; i++) {
          newPassword2 = newPassword2.toString().replace(persian[i], english[i]);
        }
        this.setState({newPassword2: newPassword2});
        break;
    }
  }

  async sendToServer() {
    this.setState({loader: true, disabled: true});
    await AsyncStorage.getItem('data').then(res => {
      let response = JSON.parse(res);
      this.setState({ISO: response});
    });
    if (!global.btoa) {
      global.btoa = encode;
    }
    let headers = {
      'Authorization': 'Basic ' + btoa(this.state.ISO),
    };
    if (this.state.newPassword1 === this.state.newPassword2) {
      axios.post(api.url + '/api/Customer/ChangePassword?password=' + this.state.newPassword1 + '&oldPassword=' + this.state.oldPassword, {}, {headers: headers})
        .then(() => {
          this.setState({loader: false, disabled: false});
          AsyncStorage.removeItem('user');
          AsyncStorage.removeItem('data');
          AsyncStorage.removeItem('pass');
          AsyncStorage.setItem('login', JSON.stringify(false));
          Actions.reset('splash');
        })
        .catch((error) => {
          console.info(error)
        })
    } else {
      this.setState({equal: false})
    }
  }

  render() {
    return (
      <BaseLightbox verticalPercent={0.7} horizontalPercent={0.36} close={false} backgroundColor={'rgba(52,52,52,0.5)'}>
        <View style={PassPopup.mainView}>
          <View style={PassPopup.orderFather}>
            <Text style={{fontSize: 10, fontFamily: 'Vazir-FD', color: '#333333', marginLeft: 30, padding: 0, margin: 0}}>کلمه عبور قبلی</Text>
            <View style={PassPopup.order}>
              <Input secureTextEntry={true} name="lastPass" type="text" style={PassPopup.orderInput} placeholder="" onChangeText={(text) => this.change('oldPassword', text)}/>
            </View>
          </View>
          <View style={PassPopup.orderFather}>
            <Text style={{fontSize: 10, fontFamily: 'Vazir-FD', color: '#333333', marginLeft: 30}}>کلمه عبور جدید</Text>
            <View style={PassPopup.order}>
              <Input secureTextEntry={true} name="newPass" type="text" style={PassPopup.orderInput} placeholder="" onChangeText={(text) => this.change('newPassword1', text)}/>
            </View>
          </View>
          <View style={PassPopup.orderFather}>
            <Text style={{fontSize: 10, fontFamily: 'Vazir-FD', color: '#333333', marginLeft: 30}}>تکرار کلمه عبور جدید</Text>
            <View style={PassPopup.order}>
              <Input secureTextEntry={true} name="newPassRe" type="text" style={PassPopup.orderInput} placeholder="" onChangeText={(text) => this.change('newPassword2', text)}/>
            </View>
          </View>
          <Text style={{display: !this.state.equal ? 'flex' : 'none'}}>مقادیر دو پسوورد برابر نیست.</Text>
          <TouchableOpacity activeOpacity={0.7} style={{width: '45%', height: 40, borderRadius: 15, marginTop: 15}} onPress={() => this.sendToServer()} disabled={this.state.disabled}>
            <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={!this.state.disabled ? ['#148e91', '#2a6e85', '#3b527b'] : ['#cccccc', '#cccccc', '#cccccc']} style={PassPopup.linear}>
              {!this.state.loader && <Text style={PassPopup.submitText}>ثبت</Text>}
              {this.state.loader && <DotIndicator size={5} color="#148E91" count={5} />}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </BaseLightbox>
    )
  }
}
