import React from 'react';
import PushNotification from 'react-native-push-notification';

export default class PushController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {
    PushNotification.configure({
      onNotification: function(notification) {
        console.log( 'NOTIFICATION:', notification );
      }
    })
  }

  render() {
    return null;
  }

}
