import React,{Component} from 'react';
import RegisterStyle from '../../assets/styles/Register';
import {Image, StatusBar, TouchableOpacity} from 'react-native';
import {Container, Content, Icon, Input, Text, View} from 'native-base';
import LinearGradient from "react-native-linear-gradient";
import {Actions} from 'react-native-router-flux';
import axios from 'axios';
import api from '../../api';
import {DotIndicator} from 'react-native-indicators';

export default class Reg2 extends Component{

  constructor(props) {
    super(props);
    this.state = {
      code: '',
      recordErrors: {},
      disabled: false,
      loader: false,
      timer: 90,
      ReSend: false,
    }
  }

  componentDidMount() {
    let timer = setInterval(() => {
      if (this.state.timer === 0) {
        clearInterval(timer);
        this.setState({ReSend: true, disabled: false});
      } else {
        this.setState((prevState) => ({
          timer: prevState.timer - 1,
        }));
      }
    }, 1000);
  }

  changeCode(text) {
    this.setState({code: text, recordErrors: {}});
  }

  goNext() {
    let recordErrors = {};
    if (this.state.code.length < 4) {
      recordErrors['code'] = 'کد وارد شده اشتباه است.';
        this.setState({recordErrors});
    } else {
      this.setState({disabled: true, loader: true});
      axios.post(api.url + '/api/Customer/CreateCuromerStep2?mobileNumber=' + this.props.mobile + '&code=' + this.state.code, null)
        .then(() => {
            if (Actions.currentScene === 'reg3') {

            } else {
              Actions.reg3({nikeName: this.props.nikeName, shopImageUri: this.props.shopImageUri, mobile: this.props.mobile, code: this.state.code})
            }
          }
        )
        .catch(() =>
          recordErrors['code'] = 'کد اشتباه وارد شده است.',
          this.setState({recordErrors, loader: false, disabled: false}),
        )
    }
  }

  ReSend() {
    axios.post(api.url + '/api/Customer/CreateCuromerStep1?mobile=' + this.props.mobile + '&nikeName=' + this.props.nikeName, null)
      .then((response) => {
        this.setState({timer: 90, ReSend: false},
        () => {
          let timer = setInterval(() => {
            if (this.state.timer === 0) {
              clearInterval(timer);
              this.setState({ReSend: true});
            } else {
              this.setState((prevState) => ({
                timer: prevState.timer - 1,
              }));
            }
          }, 1000);
        }
      )
    })
    .catch(() => console.info('error'))
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
          <Image style={RegisterStyle.background} source={require('./../../pictures/background-white.png')}/>
          <View style={RegisterStyle.overlayView}>
            <View style={RegisterStyle.shopImageView}>
              <Image source={this.props.shopImageUri === '' ? require('./../../pictures/camera.png') : {uri: this.props.shopImageUri}} style={this.props.shopImageUri === '' ? RegisterStyle.selectPhotoImage1 : RegisterStyle.photoSelected1}/>
            </View>
            <View style={RegisterStyle.shopNameView}>
              <Text style={RegisterStyle.text}>{this.props.nikeName}</Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={RegisterStyle.text1}>کد ارسالی به شماره</Text>
                <Text style={RegisterStyle.text1}>{' ' + this.props.mobile + ' '}</Text>
                <Text style={RegisterStyle.text1}>را ارسال کنید.</Text>
              </View>
            </View>
            <Text style={{fontFamily: 'Vazir-FD', color: '#333333', fontSize: 14}}>{this.state.timer}</Text>
            <View style={[RegisterStyle.linear, recordErrors['code'] ? {borderColor: 'red'} : {}]}>
              <Input placeholder="__ __ __ __" style={RegisterStyle.Slide2Input} keyboardType="numeric" maxLength={4} onChangeText={(text) => this.changeCode(text)}/>
            </View>
            <Text style={{fontSize: 10, fontFamily: 'Vazir-FD', color: 'red', display: recordErrors['code'] ? 'flex' : 'none'}}>{recordErrors['code']}</Text>
            <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={!this.state.disabled ? ['#148e91', '#2a6e85', '#3b527b'] : ['#cccccc', '#cccccc', '#cccccc']} style={{marginTop: 30, borderRadius: 15, zIndex: 15}}>
              <TouchableOpacity activeOpacity={0.5} style={RegisterStyle.buttonGradient} onPress={() => this.goNext()} disabled={this.state.disabled}>
                {!this.state.loader && <Text style={RegisterStyle.nextBtnText}>ثبت</Text>}
                {this.state.loader && <DotIndicator size={5} color="#148E91" count={5} />}
              </TouchableOpacity>
            </LinearGradient>
            {this.state.ReSend &&
            <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={!this.state.disabled ? ['#148e91', '#2a6e85', '#3b527b'] : ['#cccccc', '#cccccc', '#cccccc']} style={{marginTop: 10, borderRadius: 15, zIndex: 15}}>
              <TouchableOpacity activeOpacity={0.5} style={RegisterStyle.buttonGradient} onPress={() => this.ReSend()}>
                <Text style={RegisterStyle.nextBtnText}>ارسال مجدد</Text>
              </TouchableOpacity>
            </LinearGradient>}
            <View style={{position: 'absolute', flexDirection: 'row', alignItems: 'center', bottom: 30}}>
              <TouchableOpacity style={{marginHorizontal: 2}}>
                <Icon name="circle" type="FontAwesome" style={{fontSize: 11, color: '#596d8e'}} />
              </TouchableOpacity>
              <TouchableOpacity style={{marginHorizontal: 2}}>
                <Icon name="circle" type="FontAwesome" style={{fontSize: 15, color: '#158c90'}} />
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
