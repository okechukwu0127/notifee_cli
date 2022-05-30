import React, {useEffect, useState} from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import notifee, {
  EventType,
  AndroidImportance,
  AndroidStyle,
} from '@notifee/react-native';

import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import messaging from '@react-native-firebase/messaging';

const Notification = () => {
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  async function remoteDisplayNotification(remoteMessage) {
    // Create a channel
    const channelId = await notifee.createChannel({
      id: 'default1',
      name: 'Default1 Channel',
      sound: 'crowing_2470',
    });

    // Display a notification
    await notifee.displayNotification({
      title: remoteMessage.notification.title,
      body: remoteMessage.notification.body,
      android: {
        channelId,
        smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
        importance: AndroidImportance.HIGH,
      },
    });
  }

  async function fullScreenNotification() {
    const channelId = await notifee.createChannel({
      id: 'default2',
      name: 'Default2 Channel',
    });


    notifee.displayNotification({
      body: 'Full-screen notification',
      android: {
        // Recommended to set a category
        category: AndroidCategory.CALL,
        // Recommended to set importance to high
        importance: AndroidImportance.HIGH,

        channelId,
        fullScreenAction: {
          id: 'default2',
        },
        asForegroundService: true,
      },
    });
  }

  async function localDisplayNotification() {
    // Create a channel
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      sound: 'alarm_997',
      lights: true,
      vibration: true,
    });

    // Display a notification
    notifee.displayNotification({
      title:
        '<p style="color: #4caf50;"><b>Styled HTMLTitle</span></p></b></p> &#128576;',
      subtitle: '&#129395;',
      body: 'The <p style="text-decoration: line-through">body can</p> also be <p style="color: #ffffff; background-color: #9c27b0"><i>styled too</i></p> &#127881;!',
      android: {
        channelId,

        largeIcon: require('../assets/venco.png'),

        color: '#4caf50',
        actions: [
          {
            title: '<b>Accept</b> &#128111;',
            pressAction: {id: 'dance'},
          },
          {
            title: '<p style="color: #f44336;"><b>Reject</b> &#128557;</p>',
            pressAction: {id: 'cry'},
          },
        ],
      },
    });
  }

  async function bigPictureStyleDisplayNotification() {
    // Create a channel
    const channelId = await notifee.createChannel({
      id: 'Big_Picture',
      name: 'Big_Picture Channel',
      sound: 'crowing_2470',
      lights: true,
      vibration: true,
    });

    // Display a notification
    notifee.displayNotification({
      title: 'Image uploaded',
      body: 'Your image has been successfully uploaded',
      //subtitle: '&#129395;',
      android: {
        channelId,

        largeIcon: require('../assets/venco.png'),

        color: '#4caf50',
        style: {
          type: AndroidStyle.BIGPICTURE,
          picture:
            'https://media.licdn.com/media/AAYQAgTPAAgAAQAAAAAAADVuOvKzTF-3RD6j-qFPqhubBQ.png',
        },
      },
    });
  }

  useEffect(() => {
    requestUserPermission();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('remoteMessage', JSON.stringify(remoteMessage));
      remoteDisplayNotification(remoteMessage);
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    return unsubscribe;
  }, []);

  return (
    <ActionButton bgColor="#13151387" buttonColor="rgba(231,76,60,1)">
      {/* <ActionButton.Item
        buttonColor="#9b59b6"
        //title={Platform.OS}
        title="Critical Notifications"
        onPress={() => remoteDisplayNotification()}>
        <Icon name="md-create" style={styles.actionButtonIcon} />
      </ActionButton.Item>
      <ActionButton.Item
        buttonColor="#3498db"
        title="Image in notification"
        onPress={() => {}}>
        <Icon name="md-notifications-off" style={styles.actionButtonIcon} />
      </ActionButton.Item> */}

      {Platform.OS == 'android' ? (
        <ActionButton.Item
          buttonColor="#1abc9c"
          title="Local Notification"
          onPress={() => localDisplayNotification()}>
          <Icon name="md-aperture-sharp" style={styles.actionButtonIcon} />
        </ActionButton.Item>
      ) : null}

      {Platform.OS == 'android' ? (
        <ActionButton.Item
          buttonColor="#1abc9c"
          title="FullScreen Notification"
          onPress={() => fullScreenNotification()}>
          <Icon name="md-browsers-outline" style={styles.actionButtonIcon} />
        </ActionButton.Item>
      ) : null}

      {Platform.OS == 'android' ? (
        <ActionButton.Item
          buttonColor="#3498db"
          title="Big Picture Notification"
          onPress={() => bigPictureStyleDisplayNotification()}>
          <Icon name="md-browsers-outline" style={styles.actionButtonIcon} />
        </ActionButton.Item>
      ) : null}
    </ActionButton>
  );
};

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});

export default Notification;
