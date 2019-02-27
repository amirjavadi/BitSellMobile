import React, {Component} from 'react';
import RegisterStyle from '../../assets/styles/Register';
import {Animated, BackHandler, Dimensions, Image, NetInfo, StatusBar, TouchableOpacity, Easing, AsyncStorage} from 'react-native';
import {Container, Content, Icon, Input, Text, View, Button, Left, Right, Body} from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import HeaderStyle from '../../assets/styles/Header';
import {captureScreen} from 'react-native-view-shot';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import customMarker from '../../pictures/marker1.png';
import axios from 'axios';
import api from '../../api';
import DotIndicator from 'react-native-indicators/src/components/dot-indicator';
import {Actions} from 'react-native-router-flux';
import {decode, encode} from 'base-64'

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

MapboxGL.setAccessToken('pk.eyJ1Ijoic2hhaGFiMjEwMSIsImEiOiJjanBvMnk4YWgwOHZmNDJxam13OWh1a3VjIn0.EDIlLdfRNOk_iCfgOGnEXQ');

export default class Reg3 extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pass1: '',
      pass2: '',
      fName: '',
      lName: '',
      fullAddress: '',
      mobile: '',
      recordErrors: {},
      connection: false,
      center: [55.996493, 30.394711],
      GeoJSON: {},
      Modal: false,
      mapImageUri: '',
      error: false,
      disabled: false,
      loader: false,
    };
    this.animatedValue = new Animated.Value(0);
  }

  changeValue(name, text) {
    let persian = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    let english = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    switch (name) {
      case 'pass1':
        let password1 = text;
        for (let i = 0; i < 10; i++) {
          password1 = password1.toString().replace(persian[i], english[i]);
        }
        this.setState({pass1: password1});
        break;
      case 'pass2':
        let password2 = text;
        for (let i = 0; i < 10; i++) {
          password2 = password2.toString().replace(persian[i], english[i]);
        }
        this.setState({pass2: password2});
        break;
      case 'fName':
        this.setState({fName: text});
        break;
      case 'lName':
        this.setState({lName: text});
        break;
      case 'fullAddress':
        this.setState({fullAddress: text});
        break;
    }
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress.bind(this));
  }

  handleBackPress() {
    if (this.state.Modal === true) {
      return true;
    } else {
      //do nothing
    }
  };

  //animation
  animate() {
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 250,
      easing: Easing.linear,
    }).start();
  }

  animate1() {
    Animated.timing(this.animatedValue, {
      toValue: 0,
      duration: 250,
      easing: Easing.linear,
    }).start();
  }

  //map
  async checkNetwork() {
    let recordErrors = this.state.recordErrors;
    recordErrors['map'] = null;
    this.setState({recordErrors});
    await NetInfo.isConnected.fetch().then((isConnected) => {
      if (isConnected === false) {
        this.setState({connection: true});
      } else {
        this.setState({Modal: true, connection: false});
      }
    });
  }

  setMapUrl() {
    if (Object.getOwnPropertyNames(this.state.GeoJSON).length === 0) {
      this.animate();
      setTimeout(() => {
        this.animate1();
      }, 2000);
    } else {
      this.setState({center: this.state.GeoJSON.geometry.coordinates});
      setTimeout(() => {
        this.capture();
      }, 50);
    }
  }

  capture() {
    captureScreen({
      format: 'jpg',
      quality: 0.8,
    }).then(
      uri => {
        this.setState({mapImageUri: uri});
      },
    );
    this.setState({Modal: false});
  }

  marker() {
    return (
      <MapboxGL.ShapeSource id="marker-source" shape={this.state.GeoJSON}>
        <MapboxGL.SymbolLayer id="marker-style-layer" style={{iconImage: customMarker, iconSize: 0.4}} />
      </MapboxGL.ShapeSource>);
  }

  async renderMarker(event) {
    await this.setState({GeoJSON: event});
  }

  mapModal() {
    const marginTop = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 60],
    });
    return (
      <View style={{width: deviceWidth, height: deviceHeight, backgroundColor: 'white', position: 'absolute', zIndex: 10000}}>
        <View style={[HeaderStyle.main, {zIndex: 2}]}>
          <Left>
            <Button transparent={true} onPress={() => this.setMapUrl()}><Icon type="MaterialCommunityIcons" name="check" style={{color: 'white', fontSize: 24}} /></Button>
          </Left>
          <Body><Text style={[HeaderStyle.title, {fontSize: 15}]}>نقشه</Text></Body>
          <Right style={HeaderStyle.right}>
            <Button transparent={true} onPress={() => this.setState({Modal: false})}><Icon type="MaterialCommunityIcons" name="close"
                                                                                           style={{color: 'white', fontSize: 24}} /></Button>
          </Right>
        </View>
        <View style={{width: deviceWidth, height: 120, position: 'absolute', alignItems: 'center', zIndex: 1}}>
          <Animated.View style={{padding: 10, height: 50, backgroundColor: 'rgba(255,34,3,0.7)', marginTop, alignItems: 'center', justifyContent: 'center', borderRadius: 4}}>
            <Text style={{fontFamily: 'Vazir-FD', color: '#ffffff', fontSize: 14}}>لطفا مکان مغازه خود را مشخص کنید.</Text>
          </Animated.View>
        </View>
        <MapboxGL.MapView
          styleURL={MapboxGL.StyleURL.Street}
          zoomLevel={12}
          centerCoordinate={this.state.center}
          style={{flex: 1}}
          showUserLocation={true}
          onLongPress={this.renderMarker.bind(this)}>
          {this.state.GeoJSON !== null && this.marker()}
        </MapboxGL.MapView>
      </View>
    );
  }

  submitRegister() {
    this.validator((valid) => {
      if (valid) {
        let data = {
          firstName: this.state.fName,
          lastName: this.state.lName,
          postalAddress: this.state.fullAddress,
          mobileNumber: this.props.mobile,
          nikeName: this.props.nikeName,
          geometryString: `POINT (${this.state.GeoJSON.geometry.coordinates[0]} ${this.state.GeoJSON.geometry.coordinates[1]})`,
          geoJson: JSON.stringify(this.state.GeoJSON),
        };
        this.setState({loader: true, disabled: true});
        if (!global.btoa) {
          global.btoa = encode;
        }
        let JSONData = JSON.stringify(data);
        let headers = {
          'Content-Type': 'application/json',
        };
        let ISO = `${this.props.mobile}:${this.state.pass1}`;
        let headers1 = {
          'Authorization': 'Basic ' + btoa(ISO),
        };
        axios.post(api.url + '/api/Customer/CreateCuromerStep3?password=' + this.state.pass1 + '&code=' + this.props.code, JSONData, {headers: headers})
          .then((response) => {
            let body = new FormData();
            body.append('photo', {uri: this.props.shopImageUri, name: 'photo.png', filename: 'imageName.png', type: 'image/png'});
            body.append('Content-Type', 'image/png');
            axios.post(api.url + '/api/Customer/UploadImage?mobileNumber=' + this.props.mobile, body, {headers: headers1})
              .then((response) => Actions.reset('login2'))
              .catch((error) => Actions.reset('login2'))
          })
          .catch((error) => {console.info('error')});
      } else {
        this.setState({error: true});
      }
    });
  }

  validator(rcallback) {
    let recordFormIsValid = true;
    let recordErrors = {};
    //pass1
    if (this.state.pass1.length < 4) {
      recordFormIsValid = false;
      recordErrors['pass1'] = 'حداقل 4 کاراکتر';
    } else if (this.state.pass1 !== this.state.pass2) {
      recordFormIsValid = false;
      recordErrors['equal'] = 'مقادیر دو پسورد برابر نیست.';
    }
    //first name
    if (this.state.fName.length < 3) {
      recordFormIsValid = false;
      recordErrors['fName'] = 'حداقل 3 کاراکتر';
    }
    //last name
    if (this.state.lName.length < 3) {
      recordFormIsValid = false;
      recordErrors['lName'] = 'حداقل 3 کاراکتر';
    }
    //address
    if (this.state.fullAddress.length < 10) {
      recordFormIsValid = false;
      recordErrors['address'] = 'حداقل 10 کاراکتر';
    }
    //map
    if (this.state.mapImageUri === '') {
      recordFormIsValid = false;
      recordErrors['map'] = 'موقعیت فروشگاه را روی نقشه مشخص کنید.';
    }
    this.setState({recordErrors}, () => {
      return rcallback(recordFormIsValid);
    });
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
          <Image style={RegisterStyle.background} source={require('./../../pictures/background-white.png')} />
          <View style={RegisterStyle.overlayView}>
            <View style={RegisterStyle.shopImageView}>
              <Image source={this.props.shopImageUri === '' ? require('./../../pictures/camera.png') : {uri: this.props.shopImageUri}}
                     style={this.props.shopImageUri === '' ? RegisterStyle.selectPhotoImage1 : RegisterStyle.photoSelected1} />
            </View>
            <View style={RegisterStyle.reg3shopNameView}>
              <Text style={RegisterStyle.text}>{this.props.nikeName}</Text>
            </View>
            <View style={RegisterStyle.middleView}>
              <View style={[RegisterStyle.reg3row, {alignItems: 'flex-start'}]}>
                <View style={{flexDirection: 'column'}}>
                  <View style={[RegisterStyle.inReg3row, recordErrors['pass1'] ? {borderColor: 'red'} : {}]}>
                    <Icon type="MaterialCommunityIcons" name="lock-open" style={RegisterStyle.reg3inputIcon} />
                    <Input name="password" secureTextEntry={true} placeholder="رمز عبور" style={RegisterStyle.reg3input}
                           onChangeText={(text) => this.changeValue('pass1', text)} />
                  </View>
                  <Text
                    style={{display: recordErrors['pass1'] ? 'flex' : 'none', fontSize: 10, fontFamily: 'Vazir-FD', color: 'red', marginLeft: 20}}>{recordErrors['pass1']}</Text>
                </View>
                <View style={{flexDirection: 'column'}}>
                  <View style={[RegisterStyle.inReg3row, recordErrors['equal'] ? {borderColor: 'red'} : {}]}>
                    <Icon type="MaterialCommunityIcons" name="lock-open" style={RegisterStyle.reg3inputIcon} />
                    <Input name="passwordRepeat" secureTextEntry={true} placeholder="تکرار رمز عبور" style={RegisterStyle.reg3input}
                           onChangeText={(text) => this.changeValue('pass2', text)} />
                  </View>
                </View>
              </View>
              <Text style={{display: recordErrors['equal'] ? 'flex' : 'none', fontSize: 10, fontFamily: 'Vazir-FD', color: 'red', marginLeft: 20}}>{recordErrors['equal']}</Text>
              <View style={[RegisterStyle.reg3row, RegisterStyle.marginTop, {alignItems: 'flex-start'}]}>
                <View style={{flexDirection: 'column'}}>
                  <View style={[RegisterStyle.inReg3row, recordErrors['fName'] ? {borderColor: 'red'} : {}]}>
                    <Icon type="MaterialCommunityIcons" name="account" style={RegisterStyle.reg3inputIcon} />
                    <Input name="firstName" placeholder="نام" style={RegisterStyle.reg3input} onChangeText={(text) => this.changeValue('fName', text)} />
                  </View>
                  <Text
                    style={{display: recordErrors['fName'] ? 'flex' : 'none', fontSize: 10, fontFamily: 'Vazir-FD', color: 'red', marginLeft: 20}}>{recordErrors['fName']}</Text>
                </View>
                <View style={{flexDirection: 'column'}}>
                  <View style={[RegisterStyle.inReg3row, recordErrors['lName'] ? {borderColor: 'red'} : {}]}>
                    <Icon type="MaterialCommunityIcons" name="account" style={RegisterStyle.reg3inputIcon} />
                    <Input name="lastName" placeholder="نام خانوادگی" style={RegisterStyle.reg3input} onChangeText={(text) => this.changeValue('lName', text)} />
                  </View>
                  <Text
                    style={{display: recordErrors['lName'] ? 'flex' : 'none', fontSize: 10, fontFamily: 'Vazir-FD', color: 'red', marginLeft: 20}}>{recordErrors['lName']}</Text>
                </View>
              </View>
              <View style={[RegisterStyle.reg3row, RegisterStyle.marginTop, {flexDirection: 'column'}]}>
                <View style={[RegisterStyle.inReg3row, {width: '100%'}, recordErrors['address'] ? {borderColor: 'red'} : {}]}>
                  <Icon type="FontAwesome" name="map-marker" style={RegisterStyle.reg3inputIcon} />
                  <Input name="address" placeholder="آدرس کامل" style={RegisterStyle.reg3input} onChangeText={(text) => this.changeValue('fullAddress', text)} />
                </View>
                <Text style={{
                  display: recordErrors['address'] ? 'flex' : 'none',
                  fontSize: 10,
                  fontFamily: 'Vazir-FD',
                  color: 'red',
                  marginLeft: 20,
                }}>{recordErrors['address']}</Text>
              </View>
            </View>
            <View style={RegisterStyle.mapView}>
              <Text style={RegisterStyle.mapText}>موقعیت فروشگاه خود را در نقشه مشخص کنید.</Text>
              <TouchableOpacity activeOpacity={0.6} style={[RegisterStyle.mapBTN, recordErrors['map'] ? {borderColor: 'red'} : {}]} onPress={() => this.checkNetwork()}>
                {this.state.connection && <Text style={RegisterStyle.netError}>اتصال به اینترنت برقرار نیست</Text>}
                {!this.state.connection &&
                <Image source={this.state.mapImageUri === '' || this.state.mapImageUri === null ? require('./../../pictures/map.png') : {uri: this.state.mapImageUri}}
                       style={this.state.mapImageUri === null || this.state.mapImageUri === ''
                         ? RegisterStyle.noMapImage
                         : RegisterStyle.mapImage} />}
                <Text style={{display: recordErrors['map'] ? 'flex' : 'none', fontSize: 10, fontFamily: 'Vazir-FD', color: 'red', marginLeft: 20}}>{recordErrors['map']}</Text>
              </TouchableOpacity>
            </View>
            <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={!this.state.disabled ? ['#148e91', '#2a6e85', '#3b527b'] : ['#cccccc', '#cccccc', '#cccccc']}
                            style={{marginTop: 20, borderRadius: 15, zIndex: 15}}>
              <TouchableOpacity activeOpacity={0.5} style={RegisterStyle.buttonGradient} onPress={() => this.submitRegister()} disabled={this.state.disabled}>
                {!this.state.loader && <Text style={RegisterStyle.nextBtnText}>ثبت</Text>}
                {this.state.loader && <DotIndicator size={5} color="#148E91" count={5} />}
              </TouchableOpacity>
            </LinearGradient>
            {!this.state.error && <View style={{position: 'absolute', flexDirection: 'row', alignItems: 'center', bottom: 30}}>
              <TouchableOpacity style={{marginHorizontal: 2}}>
                <Icon name="circle" type="FontAwesome" style={{fontSize: 11, color: '#596d8e'}} />
              </TouchableOpacity>
              <TouchableOpacity style={{marginHorizontal: 2}}>
                <Icon name="circle" type="FontAwesome" style={{fontSize: 11, color: '#596d8e'}} />
              </TouchableOpacity>
              <TouchableOpacity style={{marginHorizontal: 2}}>
                <Icon name="circle" type="FontAwesome" style={{fontSize: 15, color: '#158c90'}} />
              </TouchableOpacity>
            </View>}
          </View>
          {this.state.Modal && this.mapModal()}
        </Content>
      </Container>
    );
  }

}
