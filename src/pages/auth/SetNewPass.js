import React, {Component} from 'react';
import {Image, StatusBar, TouchableOpacity} from 'react-native';
import {Container, Content, Icon, Input, Text, View} from 'native-base';
import SetNewPassStyle from '../../assets/styles/SetNewPass';
import LinearGradient from 'react-native-linear-gradient';
import DotIndicator from 'react-native-indicators/src/components/dot-indicator';
import axios from 'axios';
import api from './../../api';
import {Actions} from 'react-native-router-flux';

export default class SetNewPass extends Component {

  constructor(props) {
    super(props);
    this.state = {
      recordErrors: {},
      code: '',
      pass1: '',
      pass2: '',
      loader: false,
      disabled: false,
    };
  }

  setValue(name, value) {
    let {recordErrors} = this.state;
    switch (name) {
      case 'code' :
        recordErrors['code'] = null;
        this.setState({code: value, recordErrors});
        break;
      case 'pass1' :
        recordErrors['pass1'] = null;
        this.setState({pass1: value, recordErrors});
        break;
      case 'pass2':
        recordErrors['equal'] = null;
        this.setState({pass2: value, recordErrors});
        break;
    }
  }

  validator(callback) {
    let recordFormIsValid = true;
    let recordErrors = {};
    //code
    if (this.state.code.length < 4) {
      recordFormIsValid = false;
      recordErrors['code'] = 'کد اشتباه وارد شده است.';
    }
    //pass1 vs pass2
    if (this.state.pass1.length < 4) {
      recordFormIsValid = false;
      recordErrors['pass1'] = 'حداقل 4 کاراکتر';
    } else if (this.state.pass1 !== this.state.pass2) {
      recordFormIsValid = false;
      recordErrors['equal'] = 'مقادیر دو پسوورد برابر نیست.';
    }
    this.setState({recordErrors}, () => {
      return callback(recordFormIsValid);
    })
  }

  sendToServer() {
    this.validator((valid) => {
      if (valid) {
        this.setState({loader: true, disabled: true});
        axios.post(api.url + `/api/Customer/VerificationCodeAndResetPassword?mobileNumber=${this.props.mobile}&code=${this.state.code}&password=${this.state.pass1}`)
          .then(() => Actions.reset('login2'))
          .catch((error) => console.info(error))
      }
    })
  }

  render() {
    let {recordErrors} = this.state;
    return (
      <Container>
        <StatusBar
          backgroundColor="#404e67"
          barStyle="light-content"
        />
        <Content>
          <Image style={SetNewPassStyle.background} source={require('./../../pictures/background-white.png')} />
          <View style={SetNewPassStyle.overlayView}>
            <Image source={require('./../../pictures/bitsell-logo-noshadow.png')} style={SetNewPassStyle.logo} />
            <View style={SetNewPassStyle.shopNameView}>
              <Text style={SetNewPassStyle.text}>ثبت رمز جدید</Text>
              <View style={{flexDirection: 'row', marginTop: 5}}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={SetNewPassStyle.text1}>کد ارسالی به شماره</Text>
                  <Text style={SetNewPassStyle.text1}>{' ' + this.props.mobile + ' '}</Text>
                  <Text style={SetNewPassStyle.text1}>را ارسال کنید.</Text>
                </View>
              </View>
            </View>
            <View style={[SetNewPassStyle.linear, {borderColor: recordErrors['code'] ? 'red' : '#757575'}]}>
              <Input placeholder="....." style={SetNewPassStyle.Slide2Input} keyboardType="numeric" maxLength={4} onChangeText={(text) => this.setValue('code', text)} />
            </View>
            <Text style={{fontSize: 10, fontFamily: 'Vazir-FD', color: 'red', display: recordErrors['code'] ? 'flex' : 'none'}}>{recordErrors['code']}</Text>
            <View style={SetNewPassStyle.newPass}>
              <View style={{flexDirection: 'column', marginTop: this.state.recordErrors.length > 1 ? 10 : 20, justifyContent: 'center'}}>
                <Text style={SetNewPassStyle.text1}>رمز عبور جدید</Text>
                <View style={[SetNewPassStyle.linear, {marginTop: 5, borderColor: recordErrors['pass1'] ? 'red' : '#757575'}]}>
                  <Input placeholder="....." style={SetNewPassStyle.Slide2Input} keyboardType="numeric" maxLength={11} onChangeText={(text) => this.setValue('pass1', text)} />
                </View>
              </View>
              <View style={{flexDirection: 'column', marginTop: 20, justifyContent: 'center'}}>
                <Text style={SetNewPassStyle.text1}>تکرار رمز عبور جدید</Text>
                <View style={[SetNewPassStyle.linear, {marginTop: 5, borderColor: recordErrors['equal'] ? 'red' : '#757575'}]}>
                  <Input placeholder="....." style={SetNewPassStyle.Slide2Input} keyboardType="numeric" maxLength={11} onChangeText={(text) => this.setValue('pass2', text)} />
                </View>
              </View>
            </View>
            <Text style={{display: recordErrors['pass1'] ? 'flex' : 'none', fontSize: 10, fontFamily: 'Vazir-FD', color: 'red'}}>{recordErrors['pass1']}</Text>
            <Text style={{display: recordErrors['equal'] ? 'flex' : 'none', fontSize: 10, fontFamily: 'Vazir-FD', color: 'red'}}>{recordErrors['equal']}</Text>
            <Text style={{fontSize: 10, fontFamily: 'Vazir-FD', color: 'red', marginTop: 3, display: recordErrors['mobile'] ? 'flex' : 'none'}}>شماره موبایل اشتباه وارد شده
              است.</Text>
            <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={!this.state.disabled ? ['#148e91', '#2a6e85', '#3b527b'] : ['#cccccc', '#cccccc', '#cccccc']}
                            style={{marginTop: 30, borderRadius: 15, zIndex: 15}}>
              <TouchableOpacity activeOpacity={0.5} style={SetNewPassStyle.buttonGradient} onPress={() => this.sendToServer()} disabled={this.state.disabled}>
                {!this.state.loader && <Text style={SetNewPassStyle.nextBtnText}>ثبت</Text>}
                {this.state.loader && <DotIndicator size={5} color="#148E91" count={5} />}
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Content>
      </Container>
    );
  }

}
