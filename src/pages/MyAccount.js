import React from 'react';
import {Button, Text, Container, Content, View, Icon, Thumbnail} from 'native-base';
import Header from '../components/sections/Header';
import {StatusBar, Dimensions, Image, FlatList, TouchableNativeFeedback, Platform, TouchableOpacity, Animated, ScrollView, StyleSheet, AsyncStorage} from 'react-native';
import {Actions} from 'react-native-router-flux';
import axios from 'axios';
import api from '../api';
import {encode} from 'base-64';
import DotIndicator from 'react-native-indicators/src/components/dot-indicator';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');
const firstWidth = deviceWidth / 14;

const HEADER_MAX_HEIGHT = deviceHeight / 7 + deviceHeight / 14;
const HEADER_MIN_HEIGHT = 0;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default class MyAccount extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      scrollY: new Animated.Value(0),
      map: '',
      location: '',
      ISO: '',
      loader: false,
      disabled: false,
    };
  }

  componentDidMount(){
    let counts = [];
    let array = [];
    this.props.groupId.forEach((item, index) => {
      counts[item] = (counts[item] || 0) + 1;
      array.push({id: item.companyId, count: counts[item], name: item.groupName, days: item.Days});
      array = array.filter((i, index) => i.id !== item.companyId || i.count >= counts[item]);
    });
    this.setState({data: array})
  }

  _renderScrollViewContent() {
    const data = this.state.data;
    return(
      <View style={styles.scrollViewContent}>
        {data.map((item, index) =>
          <View key={index} style={{width: deviceWidth - 30, height: deviceHeight / 11, flexDirection: 'row', marginBottom: 4, backgroundColor: 'white', justifyContent: 'space-around', alignItems: 'center', borderWidth: 0.5, borderColor: '#bbbbbb', padding: 5}}>
            <View style={{width: '74%', height: '100%', flexDirection: 'row', alignItems: 'center'}}>
              <View style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', marginHorizontal: 5, marginVertical: 15}}>
                <Text style={{width: '100%', fontFamily: 'Vazir-FD', color: '#333333', fontSize: item.name.length > 20 ? 12 : 14}}>{item.name}</Text>
                <View style={{width: '100%', flexDirection: 'row'}}>
                  <Text style={{fontFamily: 'Vazir-FD', color: '#333333', fontSize: 9, flexWrap: 'wrap', maxWidth: deviceWidth / 2}}>زمان تحویل: </Text>
                  {item.days.map((i, index) =>
                    <Text numberOfLines={1} key={index}
                          style={{fontFamily: 'Vazir-FD', color: '#333333', fontSize: 9, flexWrap: 'wrap', maxWidth: deviceWidth / 2}}>{i}{index < item.days.length - 1 ? '\xa0_\xa0' : ''}</Text>
                  )}
                </View>
              </View>
            </View>
            <View style={{minWidth: '22%', height: '45%', backgroundColor: '#01b4b8', alignSelf: 'flex-end', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{...Platform.select({
                  ios: {
                    fontFamily: 'Vazir-FD',
                    fontWeight: 'bold',
                    textAlign: 'center'
                  },
                  android: {
                    textAlign: 'center',
                    fontFamily: 'Vazir-Bold-FD',
                  }
                }), color: 'white', fontSize: 9, flexWrap: 'wrap', maxWidth: deviceWidth / 2}}>تعداد اقلام </Text>
              <Text style={{
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
                }), fontSize: 10, color: 'white', textAlign: 'center'}}>({item.count})</Text>
            </View>
          </View>
        )}
      </View>
    );
  }

  async _sendData(bool) {
    this.setState({disabled: true, loader: true});
    await navigator.geolocation.getCurrentPosition((position) => this.setState({location: `POINT(${position.coords.latitude} ${position.coords.longitude})`}));
    this.nextStep(bool);
  }

  async nextStep(bool) {
    await AsyncStorage.getItem('data').then(res => {
      let response = JSON.parse(res);
      this.setState({ISO: response})
    });
    if (!global.btoa) {
      global.btoa = encode;
    }
    let headers = {
      'Authorization': 'Basic ' + btoa(this.state.ISO),
      'Content-Type': 'application/json'
    };
    let data = this.props.groupId;
    for (let i = 0; i < data.length; i++) {
      delete data[i].groupName;
      delete data[i].Days;
    }
    axios.post(api.url + `/api/Order/InsertOrder?geometryString=${this.state.location}&isOnlinePayment=${bool}`, JSON.stringify(data), {headers: headers})
      .then((response) => {this.setState({disabled: false, loader: false});Actions.success({response: response})})
      .catch((error) => console.info(2,error))
  }

  render(){
    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, deviceHeight / 12 + deviceHeight / 20],
      outputRange: [HEADER_MAX_HEIGHT, deviceHeight / 15],
      extrapolate: 'clamp',
    });
    const imageOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 5, HEADER_SCROLL_DISTANCE * 45 / 100],
      outputRange: [1, 0.5, 0],
      extrapolate: 'clamp',
    });
    const imageOpacity1 = this.state.scrollY.interpolate({
      inputRange: [HEADER_SCROLL_DISTANCE / 5, HEADER_SCROLL_DISTANCE / 4],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    const imageTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, -200],
      extrapolate: 'clamp',
    });
    return(
      <Container>
        <StatusBar
          backgroundColor="#404e67"
          barStyle="light-content"
        />
        <Header name="پروفایل" screen="cart"/>
        <View style={{flex: 1, backgroundColor: '#e4e4e4'}}>
          <View style={{width: deviceWidth, height: 35, flexDirection: 'row', backgroundColor: '#e4e4e4', elevation: 7, shadowOffset: { width: 2, height: 2}, padding: 5, alignItems: 'center'}}>
            <View style={{width:deviceWidth / 2 - 5, height: 30, alignItems: 'flex-start', justifyContent: 'center', borderRightColor: '#666666', borderRightWidth: 0.5}}>
              <Text style={{fontFamily: 'Vazir-FD', fontSize: 14, color: '#333333', marginLeft: 10}}>جمع کل</Text>
            </View>
            <View style={{width:deviceWidth / 2 - 5, height: 30, alignItems: 'flex-end', justifyContent: 'center'}}>
              <Text style={{fontFamily: 'Vazir-FD', fontSize: 14, color: '#333333', marginRight: 10}}>{this.props.mainPrice.toLocaleString('fa-IR').replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' تومان'}</Text>
            </View>
          </View>
          <ScrollView
            style={{flex: 1, marginHorizontal: 15, paddingBottom: 5}}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event([{nativeEvent: {contentOffset: {y: this.state.scrollY}}}])}>
            {this._renderScrollViewContent()}
          </ScrollView>
          <Animated.View style={[styles.header, {height: headerHeight}]}>
            <Animated.View style={{position: 'absolute', top: 0, right: 0, left: 0, opacity: imageOpacity1}}>
              <View style={{width: deviceWidth - 10, flexDirection: 'row', paddingHorizontal: 15, alignItems: 'center'}}>
                <Image source={require('./../pictures/list.png')} style={{width: firstWidth, height: deviceHeight / 14, resizeMode: 'contain', marginLeft: 4}} />
                <Text style={{width: 90, marginLeft: 5, fontFamily: 'Vazir-FD', fontSize: 12, color: '#333333'}}>گروه های پخش</Text>
                <Image source={require('./../pictures/line.png')} style={{width: deviceWidth - firstWidth - 120, marginLeft: -10, height: 3, resizeMode: 'contain'}} />
              </View>
            </Animated.View>
            <Animated.View style={{opacity: imageOpacity, transform: [{translateY: imageTranslate}], backgroundColor: '#e4e4e4', marginTop: 10}}>
              <View style={{backgroundColor: 'white', width: deviceWidth, height: deviceHeight / 7, paddingHorizontal: 10, paddingTop: 10, paddingBottom: 5, flexDirection: 'column', justifyContent: 'center', elevation: 4}}>
                <View style={{width: '100%', flexDirection: 'row', marginBottom: 8}}>
                  <Icon type="MaterialCommunityIcons" name="account" style={{fontSize: 16, color: '#00b5b8', marginRight: 3}}/>
                  <Text numberOfLines={1} style={{fontFamily: 'Vazir-FD', fontSize: 10, color: '#333333'}}>علی میرزابیگی</Text>
                </View>
                <View style={{width: '100%', flexDirection: 'row', marginBottom: 8}}>
                  <Icon type="MaterialCommunityIcons" name="cellphone-iphone" style={{fontSize: 16, color: '#00b5b8', marginRight: 3}}/>
                  <Text numberOfLines={1} style={{fontFamily: 'Vazir-FD', fontSize: 10, color: '#333333'}}>09135013582</Text>
                </View>
                <View style={{width: '95%', flexDirection: 'row'}}>
                  <Icon type="MaterialCommunityIcons" name="map-marker" style={{fontSize: 16, color: '#00b5b8', marginRight: 3}}/>
                  <Text numberOfLines={2} style={{fontFamily: 'Vazir-FD', fontSize: 10, color: '#333333'}}>کرمان - رفسنجان سه راه پست خیابان جانبازان، چهارراه پاسداران هایپرمارکت بیگی</Text>
                </View>
              </View>
            </Animated.View>
            <Animated.View style={{opacity: imageOpacity, transform: [{translateY: imageTranslate}], backgroundColor: '#e4e4e4'}}>
              <View style={{width: deviceWidth - 10, flexDirection: 'row', paddingHorizontal: 15, alignItems: 'center'}}>
                <Image source={require('./../pictures/list.png')} style={{width: firstWidth, height: deviceHeight / 14, resizeMode: 'contain', marginLeft: 4}} />
                <Text style={{width: 90, marginLeft: 5, fontFamily: 'Vazir-FD', fontSize: 12, color: '#333333'}}>گروه های پخش</Text>
                <Image source={require('./../pictures/line.png')} style={{width: deviceWidth - firstWidth - 120, marginLeft: -10, height: 3, resizeMode: 'contain'}} />
              </View>
            </Animated.View>
          </Animated.View>
          <View style={{width: deviceWidth, height: deviceHeight / 20, justifyContent: 'space-between', flexDirection: 'row-reverse', backgroundColor: '#e4e4e4', elevation: 24, shadowOffset: { width: 10, height: 10}}}>
            <TouchableOpacity activeOpacity={0.7} style={{width:deviceWidth / 2 - 1, height: deviceHeight / 20, alignItems: 'center', justifyContent: 'center', borderRightColor: '#666666', borderRightWidth: 0.5, backgroundColor: '#e84c3d'}} onPress={() => this._sendData(false)} disabled={this.state.disabled}>
              {!this.state.loader && <Text style={{
                ...Platform.select({ios: {fontFamily: 'Vazir-FD', fontWeight: 'bold', textAlign: 'center'}, android: {textAlign: 'center', fontFamily: 'Vazir-Bold-FD',}}), fontSize: 12,
                color: 'white'}}>پرداخت در محل</Text>}
              {this.state.loader && <DotIndicator size={5} color="white" count={5} />}
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} style={{width:deviceWidth / 2 - 1, height: deviceHeight / 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2dcc70'}}>
              <Text style={{
                ...Platform.select({ios: {fontFamily: 'Vazir-FD', fontWeight: 'bold', textAlign: 'center'}, android: {textAlign: 'center', fontFamily: 'Vazir-Bold-FD',}}), fontSize: 12,
                color: 'white'}}>پرداخت آنلاین</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    marginTop: 35,
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#e4e4e4',
    overflow: 'hidden',
  },
  scrollViewContent: {
    marginTop: HEADER_MAX_HEIGHT,
    backgroundColor: 'transparent'
  },
});

