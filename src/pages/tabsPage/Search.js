import React from 'react';
import {View, Text, Container, Content, Icon, Input, Spinner, Thumbnail} from 'native-base';
import {TouchableOpacity, Dimensions, StatusBar, TextInput, FlatList, TouchableNativeFeedback, Image, Platform, AsyncStorage} from 'react-native';
import Header from '../../components/sections/Header';
import PassPopup from '../../assets/styles/PassPopup';
import {Actions} from 'react-native-router-flux';
import api from './../../api';
import axios from 'axios';
import {encode} from 'base-64';
import DotIndicator from 'react-native-indicators/src/components/dot-indicator';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

export default class Search extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      result: [],
      searchValue: 'پنیر',
      noResult: false,
      loader: false,
    }
  }

  check(item){
    if (Actions.currentScene === 'singleProduct'){

    } else {
      Actions.lightbox1({productImage: item.imageIndex, productId: item.id, min: item.min, max: item.max, brandTitle: item.brandName, productTitle: item.titleProduct})
    }
  }

  renderProducts(item){
    return(
      <TouchableNativeFeedback underlayColor="#f8f8f8" style={{elevation: 1}} onPress={() => this.check(item)}>
        <View style={{width: deviceWidth -14, flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, marginHorizontal: 7, paddingVertical: 8, paddingHorizontal: 10, borderWidth: 0.3, borderColor: '#b5b5b5', backgroundColor: 'white'}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{borderColor: '#bbbbbb', borderWidth: 0.5, borderRadius: 5, paddingVertical: 5, paddingHorizontal: 5}}>
              <Thumbnail source={item.imageIndex === '' || item.imageIndex === null || item.imageIndex === undefined ? this.state.image : {uri: item.imageIndex}} style={{resizeMode: 'contain'}}/>
            </View>
            <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 0, maxWidth: '80%'}}>
              <Text style={{fontFamily: 'Vazir-FD', fontSize: item.titleProduct.length > 20 ? 12 : 14}}>{item.titleProduct + ' ' + item.brandName}</Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={{fontFamily: 'Vazir-FD', fontSize: 10, color: '#666666'}}>واحد کل: </Text>
                <Text style={{fontFamily: 'Vazir-FD', fontSize: 10, direction: 'rtl', color: '#666666'}}>{item.amountDetail === 0 ? item.sellUnit : `${item.sellUnit} معادل ${item.amountDetail} ${item.detailUnit}`}</Text>

              </View>
              <Text style={{fontFamily: 'Vazir-FD', fontSize: 10, color: '#666666', direction: 'rtl'}}>{item.min === item.max ? item.min : `از ${item.min} تا ${item.max}`} </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row-reverse'}}>
            <Image source={require('../../pictures/pNumber.png')} style={{width: 15, height: 19, resizeMode: 'contain'}}/>
            <View style={{width: 19, height: 19, backgroundColor: '#00b5b8', alignItems: 'center', justifyContent: 'center', marginRight: -4}}><Text style={{
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
              }), color: 'white', fontSize: 10}}>{item.countCompany}</Text></View>
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }

  async _search() {
    this.setState({loader: true, result: [], noData: false});
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
    let res = [];
   await axios.get(api.url + '/api/Product/SearchProducts?productName=' + this.state.searchValue + '&$expand=Brand', {headers: headers})
      .then((response) => {
        if (response.data.length < 1 ){
          this.setState({noData: true, loader: false})
        } else {
          for (let i = 0; i < response.data.length; i++) {
            let obj = {
              id: response.data[i].id,
              titleProduct: response.data[i].titleProduct,
              subTitleProduct: response.data[i].subTitleProduct,
              imageIndex: response.data[i].imageIndex,
              max: response.data[i].max.toLocaleString('fa-IR').replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' تومان',
              min: response.data[i].min.toLocaleString('fa-IR').replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' تومان',
              sellUnit: response.data[i].sellUnit,
              amountDetail: response.data[i].amountDetail,
              detailUnit: response.data[i].detailUnit,
              countCompany: response.data[i].countCompany,
              brandName: response.data[i].brand.titleBrand,
            };
            res.push(obj);
          }
          this.setState({result: res, loader: false})
        }
      })
      .catch((error) => this.setState({noResult: true, loader: false}))
  }

  render(){
    return(
      <Container>
        <StatusBar
          backgroundColor="#404e67"
          barStyle="light-content"
        />
        <Header name="جستجو"/>
        <View style={{flex: 1, backgroundColor: '#dddddd'}}>
          <View style={{width: deviceWidth - 40, height: deviceHeight / 20, backgroundColor: 'white', borderRadius: 15, borderWidth: 1, borderColor: '#bbbbbb', marginHorizontal: 20, marginVertical: 10, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 5, paddingRight: 5}}>
            <TouchableOpacity activeOpacity={0.7} style={{width: 30, height: 30, alignItems: 'center', justifyContent: 'center'}} onPress={() => this._search()}>
              <Icon type="MaterialCommunityIcons" name="magnify" style={{fontSize: 22, color: '#aaaaaa', textAlign: 'right', direction: 'rtl'}}/>
            </TouchableOpacity>
            <Input placeholder="جستجو..." style={{width: deviceWidth - 80, height: 35, paddingVertical: 0, paddingHorizontal: 5, fontFamily: 'Vazir-FD', fontSize: 14}} onSubmitEditing={()=> this._search()} onChangeText={(text) => {
              let persian = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
              let english = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
              for (let i = 0; i < 10; i++) {
                text = text.toString().replace(persian[i], english[i]);
              }
              this.setState({
                searchValue: text, noResult: false
              })
            }}/>
          </View>
          <View>
            {!this.state.noResult && <FlatList
              data={this.state.result}
              renderItem={({item}) => this.renderProducts(item)}
              keyExtractor={(item, index) => index.toString()}
            />}
            {this.state.noResult && <View style={{width: deviceWidth, alignItems: 'center', justifyContent: 'center'}}><Text style={{fontFamily: 'Vazir-FD', fontSize: 10, color: 'red'}}>اطلاعاتی وجود ندارد.</Text></View>}
            {this.state.loader && <DotIndicator size={5} color="#148E91" count={5} style={{alignSelf: 'center', marginTop: 15}}/>}
          </View>
        </View>
      </Container>
    )
  }
}
