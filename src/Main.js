import notifee, {EventType} from '@notifee/react-native';

import ContactsList from './components/ContactsList';

//Listen to the Action Press event to return the ID or do something based on ID pressed
notifee.onForegroundEvent(({type, detail}) => {
  if (type === EventType.ACTION_PRESS && detail.pressAction.id) {
    console.log('User pressed an action with the id: ', detail.pressAction.id);
  }
});

notifee.onBackgroundEvent(async ({type, detail}) => {
  const {notification, pressAction} = detail;

  // Check if the user pressed the "Mark as read" action
    if (type === EventType.ACTION_PRESS && pressAction.id === 'cry') {
      // Remove the notification
      await notifee.cancelNotification(notification.id);
    }
});
export default ContactsList;
