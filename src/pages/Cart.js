import React from 'react';
import {Container, Input, Text, View, Content, Thumbnail, Button, Icon} from 'native-base';
import {Platform, StatusBar, TouchableOpacity, Dimensions, FlatList, AsyncStorage} from 'react-native';
import Header from '../components/sections/Header';
import {connect} from 'react-redux';
import api from '../api';
import axios from 'axios';
import {encode} from 'base-64';
import {removeCart, removeHoleCart} from '../redux/actions';
import {Actions} from 'react-native-router-flux';
import CartRemovePopup from '../assets/styles/CartRemovePopup';
import BaseLightbox from '../components/lightbox/BaseLightbox';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

class Cart extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      groupId: [],
      mainPrice: 0,
      ISO: '',
    };
  }

  async componentDidMount() {
    await this.setState({data: this.props.cart});
    let group = [];
    this.state.data.map((item, index) => {
      group.push({companyId: item.groupId, groupName: item.groupTitle, Days: item.daysTitle, productId: item.productId, count: item.count, tariffId: item.tariffId});
    });
    await this.setState({groupId: group});
    this.countPrice();
  }

  countPrice(){
    let data = this.state.data;
    let itemPrice = 0;
    let lockItemPrice = 0;
    for (let j = 0; j < data.length; j++) {
      data[j].lockProducts.map((item, index) => {
        if (item.isOffer) {
          //do nothing
        } else {
          if (item.isFixSell) {
            lockItemPrice += ((item.countSell * item.price) * (100 - item.percentFoSell) / 100);
          } else {
            lockItemPrice += ((parseInt(data[j].count / item.countSell) * item.price) * (100 - item.percentFoSell) / 100);
          }
        }
      });
      data[j].lockItemPrice = lockItemPrice;
      itemPrice += ((data[j].groupPrice * data[j].count) + lockItemPrice);
      lockItemPrice = 0;
    }
    this.setState({mainPrice: itemPrice, data});
  }

  increaseOrder(item){
    let data = this.state.data;
    console.log(item.count, item.minOrderd, item.maxOrdered);
    if (item.count === item.maxOrdered) {
      //do nothing
    } else {
      item.count += 1;
      this.setState({
        data
      });
      this.countPrice();
    }
  }

  decreaseOrder(item){
    let data = this.state.data;
    if (item.count === item.minOrderd) {
      //do nothing
    } else {
      item.count -=1;
      if (item.count <= 1){
        item.count = 1
      }
      this.setState({
        data
      });
      this.countPrice();
    }
  }

  deleteProduct(item) {
    this.setState({popup: true});
    let data = this.state.data;
    this.verifyDelete((valid) => {
      if (valid) {
        console.log(1, 'true');
        // for (let i = 0; i < data.length; i++) {
        //   if (data[i].groupId === item.groupId && data[i].productId === item.productId && data[i].tariffId === item.tariffId){
        //     this.props.removeCart(item.productId, item.groupId, item.tariffId, item.count);
        //     data.splice(i, 1);
        //     break;
        //   }
        // }
        // this.setState({data});
        // this.countPrice();
      } else {
        console.log(2, 'false');
        // this.setState({popup: false})
      }
    });
  }

  verifyDelete(callback) {
    return (
      <BaseLightbox verticalPercent={0.7} horizontalPercent={0.26} close={false} backgroundColor={'rgba(52,52,52,0.5)'}>
        <View style={CartRemovePopup.mainView}>
          <View style={CartRemovePopup.order}>
            <Text style={CartRemovePopup.text}>محصول حذف شود؟</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity activeOpacity={0.7} style={{width: '45%', height: 40, borderRadius: 15}} onPress={() => {return callback(true)}}>
              <Text style={CartRemovePopup.submitText}>تایید</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} style={{width: '45%', height: 40, borderRadius: 15}} onPress={() => Actions.pop()}>
              <Text style={CartRemovePopup.submitText}>انصراف</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BaseLightbox>)
  }

  async reduxEmpty() {
    await this.setState({data: []});
    await this.countPrice();
    await this.props.removeHoleCart();
  }

  check() {
    if (Actions.currentScene === 'myAccount') {
      //do nothing
    } else {
      if (this.props.cart.length < 1) {
        //do nothing
      } else {
        Actions.myAccount({groupId: this.state.groupId, mainPrice: this.state.mainPrice});
      }
    }
  }

  renderItems(item) {
    if (this.state.data.length > 0) {
      console.log(item, item.lockItemPrice);
      return (
        <View style={{
          width: deviceWidth - 20,
          height: deviceHeight / 7 + 40,
          flexDirection: 'column',
          marginHorizontal: 10,
          marginBottom: 7,
          paddingBottom: 5,
          backgroundColor: 'white',
          alignItems: 'center',
          padding: 4
        }}>
          <View style={{width: '100%', height: deviceHeight / 7, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <View style={{width: '78%', height: '100%', flexDirection: 'row', alignItems: 'center'}}>
              <View style={{borderColor: '#bbbbbb', borderWidth: 0.5, borderRadius: 3, paddingHorizontal: 5, paddingVertical: 3}}>
                <Thumbnail small source={{uri: item.productImage}} style={{borderRadius: 0, resizeMode: 'contain'}} />
              </View>
              <View style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', marginHorizontal: 10, marginVertical: 15}}>
                <Text numberOfLines={1} style={{
                  width: '100%',
                  fontFamily: 'Vazir-FD',
                  color: '#333333',
                  fontSize: (item.productTitle.length + item.brandTitle.length) > 20 ? 12 : 14
                }}>{item.productTitle + '\xa0' + item.brandTitle}</Text>
                <Text numberOfLines={1} style={{width: '100%', fontFamily: 'Vazir-FD', color: '#333333', fontSize: item.groupTitle.length > 20 ? 10 : 12}}>{item.groupTitle}</Text>
                <View style={{flexDirection: 'row'}}>
                  {item.daysTitle.map((i, index) =>
                    <Text numberOfLines={1} key={index}
                          style={{fontFamily: 'Vazir-FD', color: '#333333', fontSize: 9, flexWrap: 'wrap', maxWidth: deviceWidth / 2}}>{i}{index < item.daysTitle.length - 1 ? '\xa0_\xa0' : ''}</Text>
                  )}
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text numberOfLines={1} style={{fontFamily: 'Vazir-FD', color: '#333333', fontSize: 9, flexWrap: 'wrap', maxWidth: deviceWidth / 2}}>قیمت تکی:</Text>
                  <Text numberOfLines={1} style={{
                    fontFamily: 'Vazir-FD',
                    color: '#333333',
                    fontSize: 9,
                    flexWrap: 'wrap',
                    maxWidth: deviceWidth / 2
                  }}>{'\xa0' + item.groupPrice.toLocaleString('fa-IR').replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' تومان' + '\xa0'}</Text>
                </View>
              </View>
            </View>
            <View style={{width: '22%', height: '100%', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end'}}>
            <View>
              <TouchableOpacity onPress={() => this.deleteProduct(item)}>
                <Icon type="MaterialCommunityIcons" name="delete" style={{fontSize: 20, color: 'red'}} />
              </TouchableOpacity>
            </View>
            <View style={{width: '100%', height: '33%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <Button small bordered transparent
                      style={{borderColor: '#ddd', borderWidth: .5, width: '30%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#eeeeee'}}
                      onPress={() => {this.increaseOrder(item)}}>
                <Icon ios="ios-add" android="md-add"
                      style={{
                        fontSize: 16,
                        color: '#333333',
                        ...Platform.select({
                          ios: {fontFamily: 'Vazir', fontWeight: 'bold'},
                          android: {fontFamily: 'Vazir-Bold'}
                        }),
                        position: 'absolute'
                      }} />
              </Button>
              <View style={{
                width: '39%',
                height: '100%',
                textAlign: 'center',
                borderWidth: .5,
                borderColor: '#ddd',
                backgroundColor: '#eeeeee',
                marginHorizontal: 2,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Text numberOfLines={1} style={{fontSize: 12, fontFamily: 'Vazir-FD', color: '#333333'}}>{item.count}</Text>
              </View>
              <Button small bordered transparent
                      style={{borderColor: '#ddd', borderWidth: .5, width: '30%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#eeeeee'}}
                      onPress={() => this.decreaseOrder(item)}>
                <Icon ios="ios-remove" android="md-remove"
                      style={{
                        fontSize: 16,
                        color: '#333333',
                        ...Platform.select({
                          ios: {fontFamily: 'Vazir', fontWeight: 'bold'},
                          android: {fontFamily: 'Vazir-Bold'}
                        }),
                        position: 'absolute'
                      }} />
              </Button>
            </View>
            <View style={{width: '100%', minHeight: deviceHeight / 28, backgroundColor: '#01b4b8', alignSelf: 'flex-end', justifyContent: 'center', alignItems: 'center'}}>
              <Text numberOfLines={1} style={{
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
                }), fontSize: 10, color: 'white', justifyContent: 'center', alignItems: 'center'
              }}>{(item.groupPrice * item.count).toLocaleString('fa-IR').replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' تومان'}</Text>
            </View>
          </View>
          </View>
          <View style={{width: '100%', height: 30, flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#dcdcdc', marginTop: 5, justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10}}>
            <Text style={{fontSize: 10, color: '#333333', fontFamily: 'Vazir-FD'}}>قیمت کالاهای قفل شده:</Text>
            <Text style={{fontSize: 10, color: '#333333', fontFamily: 'Vazir-FD'}}>{item.lockItemPrice > 0 ? item.lockItemPrice.toLocaleString('fa-IR').replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' تومان' : item.lockItemPrice}</Text>
          </View>
        </View>
      )
    }
  }

  render() {
    return (
      <Container style={{backgroundColor: '#e4e4e4'}}>
        <StatusBar
          backgroundColor="#404e67"
          barStyle="light-content"
        />
        <Header name="سبد خرید" screen="cart"/>
        <View style={{width: deviceWidth, height: 35, flexDirection: 'row', backgroundColor: '#e4e4e4', elevation: 10, shadowOffset: { width: 2, height: 2}, padding: 5, alignItems: 'center'}}>
          <View style={{width:deviceWidth / 2 - 5, height: 30, alignItems: 'flex-start', justifyContent: 'center', borderRightColor: '#666666', borderRightWidth: 0.5}}>
            <Text numberOfLines={1} style={{fontFamily: 'Vazir-FD', fontSize: 14, color: '#333333', marginLeft: 10}}>جمع کل</Text>
          </View>
          <View style={{width:deviceWidth / 2 - 5, height: 30, alignItems: 'flex-end', justifyContent: 'center'}}>
            <Text numberOfLines={1} style={{fontFamily: 'Vazir-FD', fontSize: 14, color: '#333333', marginRight: 10}}>{this.state.mainPrice.toLocaleString('fa-IR').replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' تومان'}</Text>
          </View>
        </View>
        <View style={{backgroundColor: '#e4e4e4', flex: 1}}>
          <FlatList
            data={this.state.data}
            renderItem={({item}) => this.renderItems(item)}
            keyExtractor={(item, index) => index.toString()}
            style={{paddingVertical: 5}}
          />
        </View>
        <View style={{width: deviceWidth, height: deviceHeight / 20, justifyContent: 'space-between', flexDirection: 'row-reverse', backgroundColor: '#e4e4e4', elevation: 24, shadowOffset: { width: 10, height: 10}}}>
          <TouchableOpacity activeOpacity={0.7} style={{width:deviceWidth / 2 - 1, height: deviceHeight / 20, alignItems: 'center', justifyContent: 'center', borderRightColor: '#666666', borderRightWidth: 0.5, backgroundColor: '#e84c3d'}} onPress={() => this.reduxEmpty()}>
            <Text numberOfLines={1} style={{
              ...Platform.select({ios: {fontFamily: 'Vazir-FD', fontWeight: 'bold', textAlign: 'center'}, android: {textAlign: 'center', fontFamily: 'Vazir-Bold-FD',}}), fontSize: 12,
              color: 'white'}}>پاک کردن سبد خرید</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} style={{width:deviceWidth / 2 - 1, height: deviceHeight / 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2dcc70'}} onPress={() => this.check()}>
            <Text numberOfLines={1} style={{
              ...Platform.select({ios: {fontFamily: 'Vazir-FD', fontWeight: 'bold', textAlign: 'center'}, android: {textAlign: 'center', fontFamily: 'Vazir-Bold-FD',}}), fontSize: 12,
              color: 'white'}}>ثبت خرید</Text>
          </TouchableOpacity>
        </View>
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    cart: state.cart,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    removeCart: (productId, groupId, tariffId, count) => dispatch(removeCart(productId, groupId, tariffId, count)),
    removeHoleCart: () => dispatch(removeHoleCart()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cart);
