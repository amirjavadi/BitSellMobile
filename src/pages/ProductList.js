import React from 'react';
import {View, Text, Container, Content, Spinner, Button, CardItem, Body, Thumbnail, Icon, Card} from 'native-base';
import Header from '../components/sections/Header';
import {Dimensions, FlatList, Image, TouchableNativeFeedback, StatusBar, Platform, BackHandler, AsyncStorage} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {encode} from 'base-64';
import axios from 'axios';
import api from './../api';
import DotIndicator from 'react-native-indicators/src/components/dot-indicator';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

export default class ProductList extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      ISO: '',
      products: [],
      image: require('../pictures/home.png'),
      noData: false,
    }
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
    let products = [];
    // axios.get(api.url + '/api/Product/GetProductsCategory?categoryId=' + this.props.item.id + '&$expand=Brand', {headers: headers})
    //   .then((response) => {
    //     console.log(response)
    //     if (response.data.length < 1 ){
    //       this.setState({noData: true})
    //     } else {
    //       for (let i = 0; i < response.data.length; i++) {
    //         let obj = {
    //           id: response.data[i].id,
    //           titleProduct: response.data[i].titleProduct,
    //           subTitleProduct: response.data[i].subTitleProduct,
    //           imageIndex: response.data[i].imageIndex,
    //           max: response.data[i].max.toLocaleString('fa-IR').replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' تومان',
    //           min: response.data[i].min.toLocaleString('fa-IR').replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' تومان',
    //           sellUnit: response.data[i].sellUnit,
    //           amountDetail: response.data[i].amountDetail,
    //           detailUnit: response.data[i].detailUnit,
    //           countCompany: response.data[i].countCompany,
    //           brandName: response.data[i].brand.titleBrand,
    //         };
    //         products.push(obj);
    //       }
    //       this.setState({products: products});
    //     }
    //   })
    //   .catch((error) => console.info(error));
    axios.get(api.url + '/api/Product/GetProductsWithExtendFields?categoryId=' + this.props.item.id + '&$expand=Brand', {headers: headers})
      .then((response) => {
        console.log(response)
        if (response.data.length < 1 ){
          this.setState({noData: true})
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
            products.push(obj);
          }
          this.setState({products: products});
        }
      })
      .catch((error) => {
        console.info(error)
      })
  }

  check(item){
    if (Actions.currentScene === 'singleProduct'){

    } else {
      Actions.lightbox1({productImage: item.imageIndex, productTitle: item.titleProduct, productId: item.id, min: item.min, max: item.max, brandTitle: item.brandName})
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
            <Image source={require('../pictures/pNumber.png')} style={{width: 15, height: 19, resizeMode: 'contain'}}/>
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

  render(){
    return(
      <Container>
        <StatusBar
          backgroundColor="#404e67"
          barStyle="light-content"
        />
        <Header name={this.props.item.titleCategory}/>
        <Content style={{backgroundColor: '#dddddd'}}>
          {this.state.noData &&
          <View style={{width: deviceWidth, height: deviceHeight - 135, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontSize: 12, color: 'red', fontFamily: 'Vazir-FD'}}>چیزی پیدا نشد.</Text>
          </View>}
          {!this.state.noData &&
          <FlatList
            style={{marginVertical: 10}}
            data={this.state.products}
            renderItem={({item}) => this.renderProducts(item)}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={<View style={{alignItems: 'center', justifyContent: 'center'}}>
              <DotIndicator size={5} color="#148E91" count={5} style={{alignSelf: 'center', marginTop: deviceHeight / 2 - 130}}/>
              <Text style={{fontSize: 10, color: '#333333', fontFamily: 'Vazir-FD', marginTop: 5}}>لطفا کمی صبر کنید...</Text>
            </View>}
          />}
        </Content>
      </Container>
    )
  }
}
