import React, {Component} from 'react';
import {Image, StatusBar, TouchableOpacity} from 'react-native';
import {Container, Content, Icon, Input, Text, View} from 'native-base';
import ForgetPassStyle from '../../assets/styles/ForgetPass';
import LinearGradient from "react-native-linear-gradient";
import DotIndicator from 'react-native-indicators/src/components/dot-indicator';
import {Actions} from 'react-native-router-flux';
import axios from 'axios';
import api from './../../api';

export default class ForgetPass extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mobile: '',
      recordErrors: {},
      loader: false,
      disabled: false,
    }
  }

  setValue(text) {
    this.setState({recordErrors: {}, mobile: text})
  }

  goNext() {
    this.setState({loader: true, disabled: true});
    let recordErrors = {};
    let regex = RegExp('^(09)\\d{9}$');
    if (!regex.test(this.state.mobile)) {
      recordErrors['mobile'] = 'شماره موبایل اشتباه است.';
      this.setState({recordErrors, loader: false, disabled: false})
    } else {
      axios.post(api.url + '/api/Customer/SendVarificationCodeForResetPassword?mobile=' + this.state.mobile)
        .then(() => {this.setState({loader: false, disabled: false});Actions.setNewPass({mobile: this.state.mobile})})
        .catch((error) => console.info(error));
    }
  }

  render() {
    let {recordErrors} = this.state;
    return(
      <Container>
        <StatusBar
          backgroundColor="#404e67"
          barStyle="light-content"
        />
        <Content>
          <Image style={ForgetPassStyle.background} source={require('./../../pictures/background-white.png')}/>
          <View style={ForgetPassStyle.overlayView}>
            <Image source={require('./../../pictures/bitsell-logo-noshadow.png')} style={ForgetPassStyle.logo}/>
            <View style={ForgetPassStyle.shopNameView}>
              <Text style={ForgetPassStyle.text}>فراموشی رمز عبور</Text>
              <View style={{flexDirection: 'row', marginTop: 5}}>
                <Text style={ForgetPassStyle.text1}>شماره موبایل خود را وارد کنید.</Text>
              </View>
            </View>
            <View style={[ForgetPassStyle.linear, {borderColor: recordErrors['mobile'] ? 'red' : '#757575'}]}>
              <Input placeholder="....." style={ForgetPassStyle.Slide2Input} keyboardType="numeric" maxLength={11} onChangeText={(text) => this.setValue(text)}/>
            </View>
            <Text style={{fontSize: 10, fontFamily: 'Vazir-FD', color: 'red', marginTop: 3, display: recordErrors['mobile'] ? 'flex' : 'none'}}>شماره موبایل اشتباه وارد شده است.</Text>
            <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={!this.state.disabled ? ['#148e91', '#2a6e85', '#3b527b'] : ['#cccccc', '#cccccc', '#cccccc']} style={{marginTop: 30, borderRadius: 15, zIndex: 15}}>
              <TouchableOpacity activeOpacity={0.5} style={ForgetPassStyle.buttonGradient} onPress={() => this.goNext()} disabled={this.state.disabled}>
                {!this.state.loader && <Text style={ForgetPassStyle.nextBtnText}>ادامه</Text>}
                {this.state.loader && <DotIndicator size={5} color="#148E91" count={5} />}
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Content>
      </Container>
    )
  }

}
