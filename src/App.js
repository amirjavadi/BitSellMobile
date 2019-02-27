import React from 'react';
import {Animated, Dimensions, Easing, I18nManager, Image, StyleSheet, Platform} from 'react-native';
import {Actions, Lightbox, Router, Scene, Stack} from 'react-native-router-flux';
import {Icon, View} from 'native-base';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import RestartAndroid from 'react-native-restart-android';
import Pushe from 'react-native-pushe'
//components
import Splash from './components/Splash';
import Popup from './components/Popup';
//pages
import Search from './pages/tabsPage/Search';
import Profile from './pages/tabsPage/Profile';
import Home from './pages/tabsPage/Home';
import Brands from './pages/tabsPage/Brands';
import Categories from './pages/tabsPage/subTabsPage/Categories';
import Product from './pages/tabsPage/subTabsPage/Product';
import Category from './pages/tabsPage/Category';
import Login2 from './pages/auth/Login2';
import SingleProduct from './pages/SingleProduct';
import Cart from './pages/Cart';
import MyAccount from './pages/MyAccount';
import Reg1 from './pages/auth/Reg1';
import Reg2 from './pages/auth/Reg2';
import Reg3 from './pages/auth/Reg3';
import ProfilePopup from './components/ProfilePopup';
import PassPopup from './components/PassPopup';
import ProductList from './pages/ProductList';
//redux
import {connect, Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/es/integration/react';
import configureStore from './redux/store';
import ForgetPass from './pages/auth/ForgetPass';
import SetNewPass from './pages/auth/SetNewPass';
import Success from './pages/Success';

I18nManager.forceRTL(true);

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');
const secondDeviceHeight = deviceHeight / 8;

const {persistor, store} = configureStore();

class TabIcon extends React.Component {
  render() {
    let color = this.props.focused ? '#00b5b8' : '#b6b6b6';
    switch (this.props.iconName) {
      case 'brands' :
        return <Icon type="FontAwesome" name="trophy" style={{color: color, fontSize: 24}} />;
      case 'category' :
        return <Icon type="FontAwesome" name="bars" style={{color: color, fontSize: 24}} />;
      case 'search' :
        return <Icon type="FontAwesome" name="search" style={{color: color, fontSize: 24}} />;
      case 'profile' :
        return <Icon type="FontAwesome" name="user" style={{color: color, fontSize: 24}} />;
    }
  }
}

export default class App extends React.Component {

  constructor(props) {
    super(props);
    Pushe.initialize(true);
    this.state = {
      name: '',
    };
  }

  componentDidMount() {
    if (!I18nManager.isRTL) {
      this.mapModal();
      RestartAndroid.restart();
      // RNRestart.Restart();
    }
  }

  mapModal() {
    return (
      <View style={{width: deviceWidth, height: deviceHeight, backgroundColor: 'white'}}>
        <MapboxGL.MapView
          styleURL={MapboxGL.StyleURL.Street}
          zoomLevel={12}
          style={{flex: 1}}>
        </MapboxGL.MapView>
      </View>
    );
  }

  onBackPress = () => {
    if (Actions.state.index === 0) {
      return false;
    }
    Actions.pop();
    return true;
  };

  renderIcon() {
    return (
      <Image source={require('./pictures/home.png')} style={{width: 60, height: 60, marginTop: -25, zIndex: 1000}} />
    );
  }

  render() {
    const RouterWithRedux = connect()(Router);
    const transitionConfig = () => {
      return {
        transitionSpec: {
          duration: 150,
          easing: Easing.out(Easing.poly(4)),
          timing: Animated.timing,
          useNativeDriver: true,
        },
        screenInterpolator: sceneProps => {
          const {position, layout, scene} = sceneProps;

          const thisSceneIndex = scene.index;
          const width = layout.initWidth;

          const translateX = position.interpolate({
            inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
            outputRange: [-width, 0, 0],
          });

          return {transform: [{translateX}]};
        },
      };
    };
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <RouterWithRedux backAndroidHandler={this.onBackPress}>
            <Scene key="root" hideNavBar>
              <Scene key="tabBar" tabs lazy={true} hideNavBar showLabel={false} tabBarStyle={style.tabBar} tabBarPosition="bottom" animationEnabled={false}>
                <Scene key='brands' hideNavBar icon={TabIcon} iconName="brands" initial>
                  <Scene key='brandsChild' hideNavBar component={Brands} initial />
                  <Scene key='categories' hideNavBar component={Categories} />
                  <Scene key='product' hideNavBar component={Product} />
                  <Lightbox key="lightbox">
                    <Scene hideNavBar key="singleProduct" component={SingleProduct} initial />
                    <Scene hideNavBar key="popup" component={Popup} />
                  </Lightbox>
                </Scene>
                <Scene key='categoryFather' hideNavBar icon={TabIcon} iconName="category">
                  <Scene key='category' hideNavBar component={Category} initial />
                  <Scene key='productList' hideNavBar component={ProductList} />
                  <Lightbox key="lightbox1">
                    <Scene hideNavBar key="singleProduct" component={SingleProduct} initial />
                    <Scene hideNavBar key="popup" component={Popup} />
                  </Lightbox>
                </Scene>
                <Scene hideNavBar key="home" component={Home} icon={() => this.renderIcon('home')} />
                <Scene key="searchFather" hideNavBar icon={TabIcon} iconName="search">
                  <Scene key='search' hideNavBar component={Search} initial />
                  <Lightbox key="lightbox1">
                    <Scene hideNavBar key="singleProduct" component={SingleProduct} initial />
                    <Scene hideNavBar key="popup" component={Popup} />
                  </Lightbox>
                </Scene>
                <Scene key="profileFather" hideNavBar icon={TabIcon} iconName="profile">
                  <Lightbox key="profileLightbox" hideNavBar initial>
                    <Scene key='profile' hideNavBar component={Profile} initial />
                    <Scene hideNavBar key="passPopup" component={PassPopup} />
                  </Lightbox>
                </Scene>
              </Scene>
              <Scene hideNavBar key="cart" component={Cart} />
              <Scene hideNavBar key="myAccount" component={MyAccount}/>
              <Scene hideNavBar key="success" component={Success} />
              <Scene hideNavBar key="splash" component={Splash} initial />
              <Scene hideNavBar key="login2" component={Login2} />
              <Scene hideNavBar key="forgetPass" component={ForgetPass} />
              <Scene hideNavBar key="setNewPass" component={SetNewPass} />
              <Scene hideNavBar key="reg" transitionConfig={transitionConfig}>
                <Scene hideNavBar key="reg1" component={Reg1} initial />
                <Scene hideNavBar key="reg2" component={Reg2} />
                <Scene hideNavBar key="reg3" component={Reg3} />
              </Scene>
            </Scene>
          </RouterWithRedux>
        </PersistGate>
      </Provider>
    );
  }
}
const style = StyleSheet.create({
  tabBar: {
    display: 'flex',
    backgroundColor: '#FFFFFF',
    elevation: 24,
    shadowOffset: {width: 5, height: 10},
    shadowColor: 'black',
    shadowOpacity: 1,
  },
  Tab: {
    position: 'absolute',
    backgroundColor: 'green',
    bottom: 100,
  },
});
