import React from 'react';
import Header from '../../components/sections/Header';
import {Container, Content, View, Text, Button, Icon, Left, Right, Body} from 'native-base';
import {TouchableOpacity, Dimensions, TextInput, Image, Platform, NetInfo, StatusBar, BackHandler, AsyncStorage} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-crop-picker';
import HeaderStyle from '../../assets/styles/Header';
import {captureScreen} from 'react-native-view-shot';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import customMarker from '../../pictures/marker1.png';
import api from './../../api';
import axios from 'axios';
import {Actions} from 'react-native-router-flux';
import {DotIndicator} from 'react-native-indicators';
import {encode} from 'base-64';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

export default class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      connection: true,
      modal: false,
      center: [55.996493, 30.394711],
      GeoJSON: {},
      mapImageUri: '',
      ISO: '',
      createDate: '',
      firstName: '',
      geometryString: '',
      id: '',
      lastName: '',
      lock: true,
      mobileNumber: '',
      nikeName: '',
      ordered: 0,
      phoneNumberComfirmed: true,
      postalAddress: '',
      profileImage: null,
      varification: true,
      loader: false,
      disable: false,
      ok: false,
      submit: false,
    };
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress.bind(this));
    this.setDefaultData();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress.bind(this));
  }

  handleBackPress() {
    if (this.state.modal === true) {
      return true;
    }
  };

  async setDefaultData() {
    await AsyncStorage.getItem('user')
      .then((response) => {
        console.log(response)
        let data = JSON.parse(response);
        let image = data.profileImage !== null ? data.profileImage.replace(/^~+/i, '') : '';
        this.setState({
          createDate: data.createDate,
          firstName: data.firstName,
          geometryString: data.geometryString,
          id: data.id,
          lastName: data.lastName,
          lock: data.lock,
          mobileNumber: data.mobileNumber,
          nikeName: data.nikeName,
          ordered: data.ordered,
          phoneNumberComfirmed: data.phoneNumberComfirmed,
          postalAddress: data.postalAddress,
          profileImage: api.web + image,
          varification: data.varification,
          GeoJSON: JSON.parse(data.geoJson)
        });
      });
  }

  takePicture() {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
    }).then(response => {
      if (response.mime !== '' || response.mime !== undefined) {
        this.setState({profileImage: response.path});
      }
    });
  }

  changeValue(name, text) {
    switch (name) {
      case 'nikeName' :
        this.setState({nikeName: text});
        break;
      case 'firstName':
        this.setState({firstName: text});
        break;
      case 'lastName':
        this.setState({lastName: text});
        break;
      case 'address':
        this.setState({postalAddress: text});
        break;
    }
  }

  async checkNetwork() {
    await NetInfo.isConnected.fetch().then((isConnected) => {
      if (isConnected === false) {
        this.setState({connection: false});
      } else {
        this.setState({modal: true, connection: true});
      }
    });
  }

  mapModal() {
    return (
      <View style={{width: deviceWidth, height: deviceHeight, backgroundColor: 'white', position: 'absolute', zIndex: 10000}}>
        <View style={[HeaderStyle.main, {zIndex: 2}]}>
          <Left>
            <Button transparent={true} onPress={() => this.setMapUrl()}><Icon type="MaterialCommunityIcons" name="check" style={{color: 'white', fontSize: 24}} /></Button>
          </Left>
          <Body><Text style={[HeaderStyle.title, {fontSize: 15}]}>نقشه</Text></Body>
          <Right style={HeaderStyle.right}>
            <Button transparent={true} onPress={() => this.setState({modal: false})}><Icon type="MaterialCommunityIcons" name="close"
                                                                                           style={{color: 'white', fontSize: 24}} /></Button>
          </Right>
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

  async renderMarker(event) {
    await this.setState({GeoJSON: event});
  }

  setMapUrl() {
    this.setState({center: this.state.GeoJSON.geometry.coordinates});
    setTimeout(() => {
      this.capture();
    }, 50);
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
    this.setState({modal: false});
  }

  marker() {
    return (
      <MapboxGL.ShapeSource id="marker-source" shape={this.state.GeoJSON}>
        <MapboxGL.SymbolLayer id="marker-style-layer" style={{iconImage: customMarker, iconSize: 0.4}} />
      </MapboxGL.ShapeSource>);
  }

  exit() {
    AsyncStorage.removeItem('user');
    AsyncStorage.removeItem('data');
    AsyncStorage.removeItem('pass');
    AsyncStorage.setItem('login', JSON.stringify(false));
    Actions.reset('splash');
  }

  async sendImage() {
    if (this.state.profileImage.startsWith('file')) {
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
      let body = new FormData();
      body.append('photo', {uri: this.state.profileImage, name: 'photo.png', filename: 'imageName.png', type: 'image/png'});
      body.append('Content-Type', 'image/png');
      await axios.post(api.url + '/api/Customer/UploadImage?mobileNumber=' + this.state.mobileNumber, body, {headers: headers})
        .then((response) => {
          this.setState({ok: true})
        })
        .catch((error) => console.info(1, error), this.setState({loader: false, disabled: false}));
      if (this.state.ok === true) {
        this.sendData()
      }
    } else {
      this.sendData();
    }
  }

  sendData() {
    let headers1 = {
      'Authorization': 'Basic ' + btoa(this.state.ISO),
      'Content-Type': 'application/json',
    };
    let body = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      mobileNumber: this.state.mobileNumber,
      nikeName: this.state.nikeName,
      postalAddress: this.state.postalAddress,
      geometryString: this.state.geometryString,
    };
    let data = {
      createDate: this.state.createDate,
      firstName: this.state.firstName,
      geometryString: this.state.geometryString,
      id: this.state.id,
      lastName: this.state.lastName,
      lock: this.state.lock,
      mobileNumber: this.state.mobileNumber,
      nikeName: this.state.nikeName,
      ordered: this.state.ordered,
      phoneNumberComfirmed: this.state.phoneNumberComfirmed,
      postalAddress: this.state.postalAddress,
      profileImage: this.state.profileImage,
      varification: this.state.varification,
    };
    axios.post(api.url + '/api/Customer/UpdateProfile', JSON.stringify(body), {headers: headers1})
      .then((response1) => {
        AsyncStorage.setItem('user', JSON.stringify(data));
        this.setState({loader: false, disabled: false, submit: true});
      })
      .catch((error) => console.info(2, error));
  }

  render() {
    return (
      <Container>
        <StatusBar
          backgroundColor="#404e67"
          barStyle="light-content"
        />
        {!this.state.modal && <Header name="پروفایل" />}
        <Content>
          <View style={{
            width: deviceWidth - 20,
            backgroundColor: '#ffffff',
            marginHorizontal: 10,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginVertical: 20,
            direction: 'rtl',
          }}>
            <TouchableOpacity activeOpacity={0.7} style={{
              width: deviceWidth * 27 / 100,
              height: deviceWidth * 27 / 100,
              borderWidth: 0.5,
              borderColor: '#aaaaaa',
              borderRadius: 500,
              justifyContent: 'center',
              alignItems: 'center',
            }} onPress={() => this.takePicture()}>
              <Image source={this.state.profileImage === '' || null ? require('./../../pictures/camera.png') : {uri: this.state.profileImage}}
                     style={this.state.profileImage === '' || null ? {width: deviceWidth * 18 / 100, height: deviceWidth * 18 / 100, resizeMode: 'contain'} : {
                       width: '100%',
                       height: '100%',
                       resizeMode: 'contain',
                       borderRadius: 500,
                     }} />
            </TouchableOpacity>
            <TextInput
              placeholder="نام فروشگاه"
              value={this.state.nikeName}
              style={{
                width: '90%',
                fontSize: 14,
                color: '#333333',
                fontFamily: 'Vazir-FD',
                borderBottomWidth: 1,
                borderBottomColor: '#bbbbbb',
                marginTop: 15,
                paddingVertical: 0,
                paddingHorizontal: 5,
                direction: 'rtl',
                textAlign: 'right',
              }}
              onChangeText={(text) => this.changeValue('nikeName', text)}
            />
            <TextInput
              placeholder="نام"
              value={this.state.firstName}
              style={{
                width: '90%',
                fontSize: 14,
                color: '#333333',
                fontFamily: 'Vazir-FD',
                borderBottomWidth: 1,
                borderBottomColor: '#bbbbbb',
                marginTop: 25,
                paddingVertical: 0,
                paddingHorizontal: 5,
                direction: 'rtl',
                textAlign: 'right',
              }}
              onChangeText={(text) => this.changeValue('firstName', text)}
            />
            <TextInput
              placeholder="نام خانوادگی"
              value={this.state.lastName}
              style={{
                width: '90%',
                fontSize: 14,
                color: '#333333',
                fontFamily: 'Vazir-FD',
                borderBottomWidth: 1,
                borderBottomColor: '#bbbbbb',
                marginTop: 25,
                paddingVertical: 0,
                paddingHorizontal: 5,
                direction: 'rtl',
                textAlign: 'right',
              }}
              onChangeText={(text) => this.changeValue('lastName', text)}
            />
            <TextInput
              placeholder="آدرس"
              value={this.state.postalAddress}
              style={{
                width: '90%',
                fontSize: 14,
                color: '#333333',
                fontFamily: 'Vazir-FD',
                borderBottomWidth: 1,
                borderBottomColor: '#bbbbbb',
                marginTop: 25,
                paddingVertical: 0,
                paddingHorizontal: 5,
                direction: 'rtl',
                textAlign: 'right',
              }}
              onChangeText={(text) => this.changeValue('address', text)}
            />
            <TouchableOpacity activeOpacity={0.7} style={{
              width: '90%',
              height: deviceHeight / 6,
              borderWidth: 0.5,
              borderColor: '#bbbbbb',
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 25,
            }} onPress={() => this.checkNetwork()}>
              {!this.state.connection && <Text style={{fontSize: 10, color: 'red', fontFamily: 'Vazir-FD'}}>اتصال به اینترنت برقرار نیست</Text>}
              <Image source={this.state.mapImageUri === '' ? require('./../../pictures/map.png') : {uri: this.state.mapImageUri}}
                     style={this.state.mapImageUri === '' ? {width: '50%', height: '50%', resizeMode: 'contain'} : {
                       width: '100%',
                       height: '100%',
                       resizeMode: 'cover',
                       borderRadius: 8,
                     }} />
            </TouchableOpacity>
            <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                            style={{width: deviceWidth / 3, height: deviceHeight / 20, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 25}}
                            colors={['#148e91', '#2a6e85', '#3b527b']}>
              <TouchableOpacity sctiveOpacity={0.7} style={{width: '100%', height: '100%', borderRadius: 16, justifyContent: 'center', alignItems: 'center'}} onPress={() => Actions.passPopup()}>
                <Text style={{
                  color: 'white', ...Platform.select({
                    ios: {
                      fontFamily: 'Vazir-FD',
                      fontWeight: 'bold',
                      textAlign: 'center',
                    },
                    android: {
                      textAlign: 'center',
                      fontFamily: 'Vazir-Bold-FD',
                    },
                  }), fontSize: 14,
                }}>تغییر کلمه عبور</Text>
              </TouchableOpacity>
            </LinearGradient>
            {this.state.submit && <Text style={{fontSize: 14, color: 'green', fontFamily: 'Vazir-FD', marginTop: 10}}>اطلاعات با موفقیت ویرایش شد.</Text>}
            <View style={{flexDirection: 'row', width: deviceWidth, alignItems: 'center', justifyContent: 'space-around'}}>
              <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                              style={{width: deviceWidth / 3, height: deviceHeight / 20, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: this.state.submit ? 10 : 25}}
                              colors={!this.state.disabled ? ['#148e91', '#2a6e85', '#3b527b'] : ['#cccccc', '#cccccc', '#cccccc']}>
                <TouchableOpacity sctiveOpacity={0.7} style={{width: '100%', height: '100%', borderRadius: 16, justifyContent: 'center', alignItems: 'center'}}
                                  onPress={() => this.sendImage()} disabled={this.state.disabled}>
                  {!this.state.loader && <Text style={{
                    color: 'white', ...Platform.select({
                      ios: {
                        fontFamily: 'Vazir-FD',
                        fontWeight: 'bold',
                        textAlign: 'center',
                      },
                      android: {
                        textAlign: 'center',
                        fontFamily: 'Vazir-Bold-FD',
                      },
                    }), fontSize: 14,
                  }}>ثبت اطلاعات</Text>}
                  {this.state.loader && <DotIndicator size={5} color="#148E91" count={5} />}
                </TouchableOpacity>
              </LinearGradient>
              <TouchableOpacity sctiveOpacity={0.7} style={{
                width: deviceWidth / 3,
                height: deviceHeight / 20,
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 25,
                backgroundColor: '#888888',
              }} onPress={() => this.exit()}>
                <Text style={{
                  color: 'white', ...Platform.select({
                    ios: {
                      fontFamily: 'Vazir-FD',
                      fontWeight: 'bold',
                      textAlign: 'center',
                    },
                    android: {
                      textAlign: 'center',
                      fontFamily: 'Vazir-Bold-FD',
                    },
                  }), fontSize: 14,
                }}>خروج</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Content>
        {this.state.modal && this.mapModal()}
      </Container>
    );
  }
}
