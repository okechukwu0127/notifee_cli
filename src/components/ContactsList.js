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
import notifee from '@notifee/react-native';

import Contacts from 'react-native-contacts';
import Contact from './Contact';
import Notification from './Notification';

const ContactsList = () => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const syncContacts = () => {
    setIsLoading(true);

    if (Platform.OS === 'android') {
      console.log('ask permission dialog');
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'This app would like to view your contacts.',
      }).then(() => {
        Contacts.getAll().then(contacts => {
          setContacts(contacts);
          setIsLoading(false);
          //console.log(contacts);
        });
      });
    } else {
      Contacts.getAll().then(contacts => {
        setContacts(contacts);
        setIsLoading(false);

        // console.log(contacts);
      });
    }
  };

  useEffect(() => {
    syncContacts();
  }, []);

  useEffect(() => {}, []);

  const keyExtractor = (item, idx) => {
    return item?.recordID?.toString() || idx.toString();
  };

  const {height} = Dimensions.get('screen');

  const scrollY = React.useRef(new Animated.Value(0)).current;
  const renderItem = ({item, index}) => {
    return <Contact contact={item} index={index} scrollY={scrollY} />;
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.header}>CONTACT LIST</Text>

        {isLoading ? (
          <View>
            <Text>Loading contacts...</Text>
          </View>
        ) : (
          <Animated.FlatList
            data={contacts}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: scrollY}}}],
              {useNativeDriver: true},
            )}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            style={styles.list}
          />
        )}
      </View>
      <Notification />
    </>
  );
};
const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  header: {
    marginVertical: 20,
    fontWeight: '600',
    fontSize: 17,
  },
  container: {
    flex: 1,
    paddingVertical: Platform.OS === 'android' ? 0 : 50,
    paddingHorizontal: 20,
  },
});
export default ContactsList;
