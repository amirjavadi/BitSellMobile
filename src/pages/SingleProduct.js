import React from 'react';
import {
  Dimensions,
  StatusBar,
  Image,
  FlatList,
  TouchableNativeFeedback,
  Platform,
  ScrollView,
  StyleSheet,
  Animated,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import {Container, Content, View, Text, Spinner, Thumbnail, Icon, Button} from 'native-base';
import Header from '../components/sections/Header';
import {Actions} from 'react-native-router-flux';
import {encode} from 'base-64';
import axios from 'axios';
import api from '../api';
import DotIndicator from 'react-native-indicators/src/components/dot-indicator';
import {connect} from 'react-redux';
import moment from 'jalali-moment';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');
const firstWidth = deviceWidth / 14;

const HEADER_MAX_HEIGHT = deviceHeight * 4 / 9 + 10 + deviceHeight / 14;
const HEADER_MIN_HEIGHT = 0;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default class SingleProduct extends React.Component {

  constructor(props) {
    super(props);
    this.viewabilityConfig = {viewAreaCoveragePercentThreshold: 50};
    this.state = {
      item: {},
      image: [],
      data: [],
      scrollY: new Animated.Value(0),
      hiddenUI: false,
      sliderIndex: 0,
    };
  }

  async componentDidMount(){
    await AsyncStorage.getItem('data').then(res => {
      let response = JSON.parse(res);
      this.setState({ISO: response})
    });
    if (!global.btoa) {
      global.btoa = encode;
    }
    let headers = {
      'Authorization': 'Basic ' + btoa(this.state.ISO),
    };
    let image = [];
    await axios.get(api.url + '/api/Product/GetProduct/' + this.props.productId + '/?$expand=ImagesProduct&$select=ImagesProduct', {headers: headers})
      .then((response) => {
        for (let i = 0; i < response.data.imagesProduct.length; i++) {
          let obj = {
            imagesProduct: response.data.imagesProduct[i].source,
          };
          image.push(obj);
        }
        this.setState({image: image});
      })
      .catch((error) => {
        console.info(error)
      });
    let data = [];
    let lock = [];
    await axios.get(api.url + '/api/Tariff/GetTariffs?productId=' + this.props.productId + '&$expand=LockProducts', {headers: headers})
      .then((response) => {
          for (let i = 0; i < response.data.length; i++) {
            for (let j = 0; j < response.data[i].lockProducts.length; j++) {
              lock.push(response.data[i].lockProducts[j])
            }
            let obj = {
              id: response.data[i].groupId,
              name: response.data[i].groupName,
              tariffId: response.data[i].tariffId,
              price: response.data[i].price,
              minOrderd: response.data[i].minOrderd,
              maxOrdered: response.data[i].maxOrdered,
              daysTitle: response.data[i].daysTitle,
              groupLogo: response.data[i].groupLogo !== null ? response.data[i].groupLogo.replace(/^~+/i, '') : '',
              lockProducts: lock,
              isLock: response.data[i].isLock,
              expiredDate: moment(response.data[i].expiredDate).locale('fa').format('YYYY/MM/DD')
            };
            data.push(obj);
          }
        this.setState({data});
      })
      .catch((error) => console.info(error))
  }


  check(item){
    if (Actions.currentScene === 'popup'){

    } else {
      Actions.popup({
        brandTitle: this.props.brandTitle,
        productImage: this.props.productImage,
        productTitle: this.props.productTitle,
        productId: this.props.productId,
        groupTitle: item.name,
        groupId: item.id,
        daysTitle: item.daysTitle,
        groupPrice: item.price,
        tariffId: item.tariffId,
        lockProducts: item.lockProducts,
      })
    }
  }

  _renderScrollViewContent() {
    const data = this.state.data;
    return (
      <View style={styles.scrollViewContent}>
        {data.map((item, index) =>
          <TouchableNativeFeedback key={index} underlayColor="#f8f8f8" onPress={() => this.check(item)} disabled={item.isLock}>
            <View style={{width: '100%', flexDirection: 'column', backgroundColor: 'white', marginBottom: 7, borderWidth: 0.5, borderColor: '#bbbbbb', justifyContent: 'space-between', alignItems: 'center', padding: 7}}>
              <View style={{flexDirection: 'row', height: deviceHeight / 10}}>
                <View style={{width: '77%', flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{borderColor: '#bbbbbb', borderWidth: 0.5, borderRadius: 3, marginVertical: 5}}>
                    {!item.isLock && <Thumbnail small source={{uri: api.web + item.groupLogo}} style={{borderRadius: 0, resizeMode: 'contain'}} />}
                    {item.isLock && <Icon type="FontAwesome" name="lock" style={{fontSize: 30, color: 'rgb(213,0,14)', marginHorizontal: 5}} />}
                  </View>
                  <View style={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', marginHorizontal: 10, marginVertical: 15}}>
                    <Text style={{width: '100%', fontFamily: 'Vazir-FD', color: item.isLock ? '#bbbbbb' : '#333333', fontSize: item.name.length > 20 ? 12 : 14}}>{item.name}</Text>
                    <View style={{flexDirection: 'row'}}>
                      {item.daysTitle.length === 7 && <Text key={index} style={{fontFamily: 'Vazir-FD', color: item.isLock ? '#bbbbbb' : '#333333', fontSize: 9, flexWrap: 'wrap', maxWidth: deviceWidth / 2, marginTop: 3}}>کل روزهای هفته</Text>}
                      {item.daysTitle.length < 7 && item.daysTitle.map((i, index) =>
                        <Text key={index} style={{fontFamily: 'Vazir-FD', color: item.isLock ? '#bbbbbb' : '#333333', fontSize: 9, flexWrap: 'wrap', maxWidth: deviceWidth / 2, marginTop: 3}}>{i}{index < item.daysTitle.length - 1 ? '\xa0_\xa0' : ''}</Text>
                      )}
                    </View>
                  </View>
                </View>
                <View style={{width: '23%', height: '100%', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center'}}>
                  <Text style={{fontSize: 10, fontFamily: 'Vazir-FD', color: item.isLock ? '#bbbbbb' : '#333333'}}>تاریخ انقضا:</Text>
                  <Text style={{fontSize: 10, fontFamily: 'Vazir-FD', color: '#828282', marginBottom: 3}}>{item.expiredDate}</Text>
                  <View style={{width: '100%', height: '32%', alignSelf: 'flex-end', justifyContent: 'center', alignItems: 'center', backgroundColor: item.isLock ? '#bbbbbb' : '#01b4b8'}}>
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
                      }), fontSize: 10, color: 'white', textAlign: 'center'}}>{item.price.toLocaleString('fa-IR').replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' تومان'}</Text>
                  </View>
                </View>
              </View>
              {item.lockProducts.length >= 1 &&
              <View style={{width: '100%'}}>
                <View style={{width: '100%', backgroundColor: '#dcdcdc', justifyContent: 'center', alignItems: 'center', marginTop: 7}}>
                  <Text style={{color: item.isLock ? '#bbbbbb' : '#333333', fontSize: 14, fontFamily: 'Vazir-FD'}}>محصولات قفل شده</Text>
                </View>
                {item.lockProducts.map((ite, index) =>
                  <View key={index} style={{width: '100%', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', marginTop: 5}}>
                    <View style={{width: '100%', flexDirection: 'row', borderWidth: 1, borderColor: '#dcdcdc', padding: 7}}>
                      <View style={{width: '77%', flexDirection: 'column'}}>
                        <View style={{width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                          {ite.isOffer === true && <Icon type="FontAwesome" name="gift" style={{fontSize: 16, color: '#aaaaaa', marginHorizontal: 5}} />}
                          {ite.isOffer === false && <Icon type="FontAwesome" name="lock" style={{fontSize: 16, color: '#aaaaaa', marginHorizontal: 5}} />}
                          <Text style={{fontSize: 14, fontFamily: 'Vazir-FD', color: item.isLock ? '#bbbbbb' : '#333333'}}>{ite.lockProductName}</Text>
                        </View>
                        <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 7}}>
                          <View style={{flexDirection: 'row'}}>
                            <Text style={{fontSize: 12, fontFamily: 'Vazir-FD', color: item.isLock ? '#bbbbbb' : '#333333'}}>نسبت :</Text>
                            {ite.isFixSell === true && <Text style={{fontSize: 12, fontFamily: 'Vazir-FD', color: item.isLock ? '#bbbbbb' : '#333333'}}>{ite.countOffer}</Text>}
                            {ite.isFixSell === false && <Text style={{fontSize: 12, fontFamily: 'Vazir-FD', color: item.isLock ? '#bbbbbb' : '#333333'}}>{' ' + ite.countSell + ' '}به 1 </Text>}
                          </View>
                        </View>
                      </View>
                      <View style={{width: '23%', flexDirection: 'column', alignItems: 'center'}}>
                        {ite.isOffer === false &&
                        <View style={{flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center'}}>
                          <Text style={{fontSize: 10, fontFamily: 'Vazir-FD', color: item.isLock ? '#bbbbbb' : '#333333'}}>قیمت:</Text>
                          <Text style={{fontSize: 10, fontFamily: 'Vazir-FD', color: '#828282', marginBottom: 3}}>{ite.price.toLocaleString('fa-IR').replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' تومان'}</Text>
                          <Text style={{fontSize: 9, fontFamily: 'Vazir-FD', color: item.isLock ? '#bbbbbb' : '#333333'}}>درصد تخفیف:</Text>
                          <Text style={{fontSize: 12, fontFamily: 'Vazir-FD', color: '#828282'}}>{ite.percentFoSell}%</Text>
                        </View>
                        }
                      </View>
                    </View>
                  </View>
                )}
              </View>}
            </View>
          </TouchableNativeFeedback>
        )}
      </View>
    );
  }

  _handleViewableItemsChanged = ({viewableItems}) => {
    let sliderIndex = viewableItems[0].index;
    this.setState({
      sliderIndex: sliderIndex,
    });
  };
  _renderIndicators(data) {
    return (
      <View style={{justifyContent: 'flex-end', alignItems: 'center'}}>
        <FlatList
          horizontal
          style={{position: 'absolute', zIndex: 500, paddingBottom: 5,}}
          renderItem={({item, index}) => this._renderActiveIndicator(item, index)}
          data={data}
          keyExtractor={(item, index) => `item_${index}`}
        />
      </View>
    );
  }
  _renderActiveIndicator(item, index) {
    if (this.state.sliderIndex === index) {
      return (
        <TouchableOpacity>
          <Icon name="radiobox-marked" type="MaterialCommunityIcons" style={{color: 'white', fontSize: 14}} />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity>
          <Icon name="radiobox-blank" type="MaterialCommunityIcons" style={{color: 'white', fontSize: 14}} />
        </TouchableOpacity>
      );
    }
  }



  render() {
    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, deviceHeight * 3 / 7],
      outputRange: [HEADER_MAX_HEIGHT, deviceHeight / 13],
      extrapolate: 'clamp',
    });
    const imageOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 5, HEADER_SCROLL_DISTANCE / 1.3],
      outputRange: [1, 1, 0],
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
    return (
      <Container>
        <StatusBar
          backgroundColor="#404e67"
          barStyle="light-content"
        />
        <Header name={this.props.productTitle + ' ' + this.props.brandTitle} />
        <View style={{flex: 1, backgroundColor: '#e4e4e4'}}>
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
            <Animated.View style={[styles.backgroundImage, {opacity: imageOpacity, transform: [{translateY: imageTranslate}]},]}>
              <FlatList
                style={{backgroundColor: 'white'}}
                pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={this._handleViewableItemsChanged}
                viewabilityConfig={this.viewabilityConfig}
                horizontal
                data={this.state.image}
                renderItem={({item}) => (
                    <Image source={{uri: item.imagesProduct}} style={{width: deviceWidth, height: deviceHeight / 3, resizeMode: 'contain'}}/>
                )}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={<View style={{width: deviceWidth, alignItems: 'center', justifyContent: 'center'}}>
                  <DotIndicator size={5} color="#148E91" count={5} style={{alignSelf: 'center'}}/>
                </View>}
              />
              {this._renderIndicators(this.state.image)}
            </Animated.View>
            <Animated.View style={{opacity: imageOpacity, transform: [{translateY: imageTranslate}], backgroundColor: '#e4e4e4', marginTop: deviceHeight / 3, paddingTop: 10}}>
              <View style={{width: deviceWidth - 30, height: deviceHeight / 9, flexDirection: 'column', marginHorizontal: 15, backgroundColor: 'white', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 7, borderWidth: 0.5, borderColor: '#bbbbbb'}}>
                <Text style={{fontFamily: 'Vazir-FD', fontSize: 12, color: '#333333'}}>{this.props.productTitle}</Text>
                <Text style={{fontFamily: 'Vazir-FD', fontSize: 10, color: '#01b4b8', marginBottom: 4}}>{this.props.min === this.props.max ? this.props.min : `از ${this.props.min} تا ${this.props.max}`} </Text>
              </View>
              <View style={{width: deviceWidth - 10, flexDirection: 'row', paddingHorizontal: 15, alignItems: 'center'}}>
                <Image source={require('./../pictures/list.png')} style={{width: firstWidth, height: deviceHeight / 14, resizeMode: 'contain', marginLeft: 4}} />
                <Text style={{width: 90, marginLeft: 5, fontFamily: 'Vazir-FD', fontSize: 12, color: '#333333'}}>گروه های پخش</Text>
                <Image source={require('./../pictures/line.png')} style={{width: deviceWidth - firstWidth - 120, marginLeft: -10, height: 3, resizeMode: 'contain'}} />
              </View>
            </Animated.View>
          </Animated.View>
        </View>
      </Container>
    )
  }
}
const styles = StyleSheet.create({
  row: {
    height: 40,
    margin: 16,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#e4e4e4',
    overflow: 'hidden',
  },
  bar: {
    marginTop: 28,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 18,
  },
  scrollViewContent: {
    marginTop: HEADER_MAX_HEIGHT,
    backgroundColor: 'transparent'
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: deviceHeight / 3,
    resizeMode: 'cover',
  },
});

