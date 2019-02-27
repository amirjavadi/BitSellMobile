import React from 'react';
import {View, Text, Container, Content, Spinner, Button} from 'native-base';
import Header from '../../../components/sections/Header';
import LinearGradient from "react-native-linear-gradient";
import {Actions} from 'react-native-router-flux';
import {Dimensions, Image, FlatList, TouchableNativeFeedback, StatusBar, Platform, BackHandler, AsyncStorage} from 'react-native';
import DotIndicator from 'react-native-indicators/src/components/dot-indicator';
import {encode} from 'base-64';
import axios from 'axios';
import api from '../../../api';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

export default class Categories extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      categories: [],
      titleBrand: '',
      noData: false,
    }
  }

  async componentDidMount(){
    this.setState({titleBrand: this.props.brandTitle});
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
    let categories = [];
    axios.get(api.url + '/api/Category/GetCategoriesBrand?$select=Id,Title&brandId=' + this.props.brandId, {headers: headers})
      .then((response) => {
        if (response.data.length < 1 ){
          this.setState({noData: true})
        } else {
          for (let i = 0; i < response.data.length; i++) {
            let obj = {
              idCat: response.data[i].id,
              titleCat: response.data[i].title,
            };
            categories.push(obj);
          }
          this.setState({categories: categories});
        }
      })
      .catch((error) => {
        console.info(error)
      })
  }

  check(item){
    if (Actions.currentScene === 'product'){

    } else {
      Actions.product({brandTitle: this.props.brandTitle, brandId: this.props.brandId, categoryItem: item})
    }
  }

  renderProducts(item){
    return(
      <TouchableNativeFeedback underlayColor="#f8f8f8" onPress={() => this.check(item)}>
        <View style={{width: deviceWidth - 120, height: deviceHeight / 15 + 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 50, backgroundColor: 'white', marginTop: 4, marginBottom: 4, marginHorizontal: 10}}>
          <Text style={{fontFamily: 'Vazir-FD', fontSize: 14, color: 'black'}}>{item.titleCat}</Text>
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
        <Header name={this.props.brandTitle}/>
        <View style={{display: 'flex', flex: 1, width: deviceWidth, alignItems: 'center', justifyContent: 'flex-start', backgroundColor: '#dddddd'}}>
          <Image source={require('../../../pictures/products_background.png')} style={{flex: 1, width: deviceWidth, height: deviceHeight - 25, resizeMode: 'cover'}}/>
          <View style={{position: 'absolute', width: deviceWidth - 80, height: deviceHeight - 180, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 15, marginTop: 40, paddingTop: 10, paddingBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
            {this.state.noData &&
            <View style={{width: deviceWidth, height: deviceHeight - 135, alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{fontSize: 12, color: 'red', fontFamily: 'Vazir-FD'}}>چیزی پیدا نشد.</Text>
            </View>}
            {!this.state.noData &&
            <FlatList
              data={this.state.categories}
              renderItem={({item}) => this.renderProducts(item)}
              keyExtractor={(item, index) => index.toString()}
              style={{marginTop: 5, marginBottom: 8}}
              ListEmptyComponent={<View style={{alignItems: 'center', justifyContent: 'center'}}>
                <DotIndicator size={5} color="#148E91" count={5} style={{alignSelf: 'center', marginTop: deviceHeight / 2 - 130}}/>
                <Text style={{fontSize: 10, color: '#333333', fontFamily: 'Vazir-FD', marginTop: 5}}>لطفا کمی صبر کنید...</Text>
              </View>}
            />}
            <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#148e91', '#2a6e85', '#3b527b']} style={{borderRadius: 50}}>
              <Button transparent={true} style={{width: deviceWidth - 140, height: deviceHeight / 18, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 50, marginHorizontal: 10}}><Text style={{
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
                }), fontSize: 12, color: 'white'}}>مشاهده همه محصولات</Text></Button>
            </LinearGradient>
          </View>
        </View>
      </Container>
    )
  }
}
