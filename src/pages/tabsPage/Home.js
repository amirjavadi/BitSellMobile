import React from 'react';
import {Dimensions, FlatList, Image, Platform, StatusBar, TouchableNativeFeedback, TouchableOpacity} from 'react-native';
import {View, Text, Container, Content, Icon, Spinner, Thumbnail} from 'native-base';
import Header from '../../components/sections/Header';
import Slider from '../../components/Slider';
import {Actions} from 'react-native-router-flux';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

export default class Home extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      brands: [
        {
          id: 0,
          name: 'در حال بارگذاری',
          uri: require('../../pictures/camera.png'),
          price: '0',
        },
        {
          id: 1,
          name: 'در حال بارگذاری',
          uri: require('../../pictures/camera.png'),
          price: '0',
        },
        {
          id: 2,
          name: 'در حال بارگذاری',
          uri: require('../../pictures/camera.png'),
          price: '0',
        },
        {
          id: 3,
          name: 'در حال بارگذاری',
          uri: require('../../pictures/camera.png'),
          price: '0',
        },
        {
          id: 4,
          name: 'در حال بارگذاری',
          uri: require('../../pictures/camera.png'),
          price: '0',
        },
      ],
    }
  }

  renderItemsBrands(item) {
    return(
      <TouchableNativeFeedback underlayColor="#f8f8f8" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 15}}>
        <View style={{width: deviceWidth / 3 - 23, height: deviceWidth / 3 - 23, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', borderRadius: 15, marginHorizontal: 5, marginVertical: 10, elevation: 3, shadowOffset:{  width: 3,  height: 3,  }, shadowColor: '#333333', shadowOpacity: 0.4}}>
          <Thumbnail square source={item.uri} style={{width: deviceWidth / 3 - 35, height: deviceWidth / 3 - 35, resizeMode: 'contain'}}/>
        </View>
      </TouchableNativeFeedback>
    )
  }
  renderItemsProducts(item) {
    return(
      <TouchableNativeFeedback underlayColor="#f8f8f8" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 15}}>
        <View style={{width: deviceWidth / 3 - 23, height: deviceWidth / 3 - 23, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', borderRadius: 15, marginHorizontal: 5, marginVertical: 10, elevation: 3, shadowOffset:{width: 3,  height: 3}, shadowColor: '#333333', shadowOpacity: 0.4}}>
          <Thumbnail square source={item.uri} style={{width: deviceWidth / 3 - 75, height: deviceWidth / 3 - 75, resizeMode: 'contain'}}/>
          <Image source={require('./../../pictures/line.png')} style={{width: '90%', marginTop: 3, height: 1, resizeMode: 'contain'}} />
          <Text style={{fontFamily: 'Vazir-FD', fontSize: item.name.length > 15 ? 10 : 12, color: '#333333'}}>{item.name}</Text>
          <Text style={{fontFamily: 'Vazir-FD', fontSize: item.price.length > 15 ? 8 : 9, color: '#333333'}}>{item.price}</Text>
        </View>
      </TouchableNativeFeedback>
    )
  }

  renderItemsList(item) {
    return(
      <TouchableNativeFeedback underlayColor="#f8f8f8" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 15}}>
        <View style={{width: deviceWidth / 3 - 23, height: deviceWidth / 3 - 23, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', borderRadius: 15, marginHorizontal: 5, marginVertical: 10, elevation: 3, shadowOffset:{width: 3,  height: 3}, shadowColor: '#333333', shadowOpacity: 0.4}}>
          <Thumbnail square source={item.uri} style={{width: deviceWidth / 3 - 75, height: deviceWidth / 3 - 75, resizeMode: 'contain'}}/>
          <Image source={require('./../../pictures/line.png')} style={{width: '90%', marginTop: 3, height: 1, resizeMode: 'contain'}} />
          <Text style={{fontFamily: 'Vazir-FD', fontSize: item.name.length > 15 ? 10 : 12, color: '#333333'}}>{item.name}</Text>
          <Text style={{fontFamily: 'Vazir-FD', fontSize: item.price.length > 15 ? 8 : 9, color: '#333333'}}>{item.price}</Text>
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
        <Header name="خانه"/>
        <Content style={{backgroundColor: '#dddddd'}}>
          <Slider />
          <View style={{width: '100%', alignItems: 'center', justifyContent: 'flex-start'}}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
              <Image source={require('./../../pictures/pNumberReverse.png')} style={{width: 22, height: 35, resizeMode: 'contain'}}/>
              <TouchableOpacity activeOpacity={0.7} style={{width: '75%', backgroundColor: '#00b5b8', alignItems: 'center', justifyContent: 'center', marginHorizontal: -4}} onPress={() => Actions.categoryFather()}>
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
                  }), fontSize: 14, color: 'white', paddingVertical: 7}}>مشاهده لیست دسته بندی محصولات</Text>
              </TouchableOpacity>
              <Image source={require('./../../pictures/pNumber.png')} style={{width: 22, height: 35, resizeMode: 'contain'}}/>
            </View>
            <View style={{width: '100%', flexDirection: 'column', marginTop: 15, alignItems: 'center'}}>
              <Icon type="FontAwesome" name="trophy" style={{color: '#999999', fontSize: 28}}/>
              <Text style={{fontFamily: 'Vazir-FD', fontSize: 14, color: '#333333', paddingVertical: 2}}>محبوب ترین برندها</Text>
              <Image source={require('./../../pictures/line.png')} style={{width: '90%', marginTop: 3, resizeMode: 'contain'}} />
            </View>
            <View style={{width: '100%', height: deviceWidth / 3 + 30}}>
              <FlatList
                style={{paddingHorizontal: 5, height: deviceWidth / 3}}
                horizontal={true}
                data={this.state.brands}
                renderItem={({item}) => this.renderItemsBrands(item)}
                keyExtractor={(item, index) => index.toString()}
                showsHorizontalScrollIndicator={false}/>
              <View style={{width: '100%', justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                <TouchableOpacity activeOpacity={0.7} style={{marginRight: 10, marginVertical: 5}} onPress={() => Actions.brands()}>
                  <Text style={{fontFamily: 'Vazir-FD', color: '#00b5b8', fontSize: 14, borderBottomWidth: 1, borderBottomColor: '#00b5b8', paddingHorizontal: 2}}>مشاهده برندها</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{width: '100%', flexDirection: 'column', marginTop: 15, alignItems: 'center'}}>
              <Icon type="FontAwesome" name="archive" style={{color: '#999999', fontSize: 28}}/>
              <Text style={{fontFamily: 'Vazir-FD', fontSize: 14, color: '#333333', paddingVertical: 2}}>پرفروش ترین محصولات</Text>
              <Image source={require('./../../pictures/line.png')} style={{width: '90%', marginTop: 3, resizeMode: 'contain'}} />
            </View>
            <View style={{width: '100%', height: deviceWidth / 3 + 30}}>
              <FlatList
                style={{paddingHorizontal: 5, height: deviceWidth / 3}}
                horizontal={true}
                data={this.state.brands}
                renderItem={({item}) => this.renderItemsProducts(item)}
                keyExtractor={(item, index) => index.toString()}
                showsHorizontalScrollIndicator={false} />
              <View style={{width: '100%', justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                <TouchableOpacity activeOpacity={0.7} style={{marginRight: 10, marginVertical: 5}} onPress={() => Actions.brands()}>
                  <Text style={{fontFamily: 'Vazir-FD', color: '#00b5b8', fontSize: 14, borderBottomWidth: 1, borderBottomColor: '#00b5b8', paddingHorizontal: 2}}>مشاهده محصولات</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{width: '100%', flexDirection: 'column', marginTop: 15, alignItems: 'center'}}>
              <Image source={require('./../../pictures/list9color.png')} style={{width: 28, height: 28, resizeMode: 'contain'}}/>
              <Text style={{fontFamily: 'Vazir-FD', fontSize: 14, color: '#333333', paddingVertical: 2}}>گروه های پخش</Text>
              <Image source={require('./../../pictures/line.png')} style={{width: '90%', marginTop: 3, resizeMode: 'contain'}} />
            </View>
            <View style={{height: deviceWidth / 3, marginBottom: 10}}>
              <FlatList
                style={{paddingHorizontal: 5, height: deviceWidth / 3}}
                horizontal={true}
                data={this.state.brands}
                renderItem={({item}) => this.renderItemsList(item)}
                keyExtractor={(item, index) => index.toString()}
                showsHorizontalScrollIndicator={false} />
            </View>
          </View>
        </Content>
      </Container>
    )
  }
}
