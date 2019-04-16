import React,{Component} from 'react';
import RegisterStyle from '../../assets/styles/Register';
import {Image, StatusBar, TouchableOpacity} from 'react-native';
import {Container, Content, Icon, Input, Text, View} from 'native-base';
import ImagePicker from "react-native-image-crop-picker";
import LinearGradient from "react-native-linear-gradient";
import {DotIndicator} from 'react-native-indicators';
import axios from 'axios';
import api from '../../api';
import {Actions} from 'react-native-router-flux';

export default class Reg1 extends Component{

  constructor(props) {
    super(props);
    this.state = {
      shopImageUri: '',
      nikeName: '',
      mobile: '',
      recordErrors: {},
      disabled: false,
      loader: false,
      userLocked: false,
      goLogin: false,
    }
  }

  _takePicture() {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true
    }).then(response => {
      if (response.mime !== '' || response.mime !== undefined) {
        this.setState({shopImageUri: response.path});
      }
    })
  }

  change(name, text) {
    this.setState({userLocked: false, goLogin: false, loader: false, disabled: false});
    switch (name) {
      case 'nikeName':
        this.setState({nikeName: text});
        break;
      case 'mobile':
        this.setState({mobile: text});
        break;
    }
  }

  checkValidation(rcallback) {
    let recordFormIsValid = true;
    let recordErrors = {};
    let regex = RegExp('^(09)\\d{9}$');
    //nikeName
    if (this.state.nikeName.length < 5) {
      recordFormIsValid = false;
      recordErrors['nikeName'] = 'حداقل 5 کاراکتر'
    }
    //mobile
    if (!regex.test(this.state.mobile)) {
      recordFormIsValid = false;
      recordErrors['mobile'] = 'شماره موبایل اشتباه است.'
    }
    this.setState({recordErrors}, () => {
      return rcallback(recordFormIsValid)
    })
  }

  sendSMS() {
    this.checkValidation((valid) => {
      if (valid) {
        this.setState({disabled: true, loader: true});
        axios.post(api.url + '/api/Customer/CreateCuromerStep1?mobile=' + this.state.mobile + '&nikeName=' + this.state.nikeName, null)
          .then((response) => {
            if (response.data[0] === '1') {
              this.setState({disabled: false, loader: false});
              Actions.reg2({mobile: this.state.mobile, nikeName: this.state.nikeName, shopImageUri: this.state.shopImageUri});
            } else if (response.data[0] === '2') {
              this.setState({userLocked: true, loader: false, disabled: false})
            } else if (response.data[0] === '3') {
              this.setState({goLogin: true, loader: false, disabled: false})
            }
          })
          .catch(() => console.info('error'))
      }
    })
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
          <Image style={RegisterStyle.background} source={require('./../../pictures/background-white.png')} />
          <View style={RegisterStyle.overlayView}>
            <Image source={require('./../../pictures/bitsell-logo-noshadow.png')} style={RegisterStyle.logo} />
            <View style={RegisterStyle.underLogoView}>
              <View style={{flexDirection: 'column'}}>
                <TouchableOpacity activeOpacity={0.5} style={[RegisterStyle.selectPhoto, recordErrors['shopImageUri'] ? {borderColor: 'red'} : {}]}
                                  onPress={() => this._takePicture()}>
                  <Image source={this.state.shopImageUri === '' ? require('./../../pictures/camera.png') : {uri: this.state.shopImageUri}}
                         style={this.state.shopImageUri === '' ? RegisterStyle.selectPhotoImage : RegisterStyle.photoSelected} />
                </TouchableOpacity>
                <Text style={{fontSize: 10, fontFamily: 'Vazir-FD', color: 'red', marginLeft: 20, display: recordErrors['shopImageUri'] ? 'flex' : 'none'}}>انتخاب عکس</Text>
              </View>
              <View style={RegisterStyle.inputsView}>
                <View style={[RegisterStyle.inputView, recordErrors['nikeName'] ? {borderColor: 'red'} : {}]}>
                  <Icon type="MaterialCommunityIcons" name="store" style={RegisterStyle.SecondInputIcon} />
                  <Input placeholder="نام فروشگاه" style={[RegisterStyle.input, RegisterStyle.input1]}
                         onChangeText={(text) => this.change('nikeName', text)}/>
                </View>
                <Text style={{fontSize: 10, fontFamily: 'Vazir-FD', color: 'red', marginLeft: 20, display: recordErrors['nikeName'] ? 'flex' : 'none'}}>حداقل کاراکتر مجاز پنج عدد می باشد.</Text>
                <View style={[RegisterStyle.inputView, recordErrors['mobile'] ? {borderColor: 'red'} : {}]}>
                  <Icon type="MaterialCommunityIcons" name="cellphone-iphone" style={RegisterStyle.SecondInputIcon} />
                  <Input keyboardType="numeric" placeholder="شماره همراه" style={[RegisterStyle.input, RegisterStyle.input1]} maxLength={11}
                         onChangeText={(text) => this.change('mobile', text)}/>
                </View>
                <Text style={{fontSize: 10, fontFamily: 'Vazir-FD', color: 'red', marginLeft: 20, display: recordErrors['mobile'] ? 'flex' : 'none'}}>شماره موبایل اشتباه وارد شده است.</Text>
              </View>
            </View>
            <Text style={{display: this.state.userLocked ? 'flex' : 'none', fontSize: 12, fontFamily: 'Vazir-FD', color: 'red', marginLeft: 20}}>نام کاربری شما قفل شده است.</Text>
            <Text style={{display: this.state.goLogin ? 'flex' : 'none', fontSize: 12, fontFamily: 'Vazir-FD', color: 'red', marginLeft: 20}}>
              این شماره تلفن قبلا ثبت نام کرده است.لطفا وارد شوید.</Text>
            <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={!this.state.disabled ? ['#148e91', '#2a6e85', '#3b527b'] : ['#cccccc', '#cccccc', '#cccccc']} style={{marginTop: 20, borderRadius: 15, zIndex: 15}}>
              <TouchableOpacity activeOpacity={0.5} style={RegisterStyle.buttonGradient} onPress={() => this.sendSMS()} disabled={this.state.disabled}>
                {!this.state.loader && <Text style={RegisterStyle.nextBtnText}>ثبت</Text>}
                {this.state.loader && <DotIndicator size={5} color="#148E91" count={5} />}
              </TouchableOpacity>
            </LinearGradient>
            <View style={{position: 'absolute', flexDirection: 'row', alignItems: 'center', bottom: 30}}>
              <TouchableOpacity style={{marginHorizontal: 2}}>
                <Icon name="circle" type="FontAwesome" style={{fontSize: 15, color: '#158c90'}} />
              </TouchableOpacity>
              <TouchableOpacity style={{marginHorizontal: 2}}>
                <Icon name="circle" type="FontAwesome" style={{fontSize: 11, color: '#596d8e'}} />
              </TouchableOpacity>
              <TouchableOpacity style={{marginHorizontal: 2}}>
                <Icon name="circle" type="FontAwesome" style={{fontSize: 11, color: '#596d8e'}} />
              </TouchableOpacity>
            </View>
          </View>
        </Content>
      </Container>
    )
  }

}
