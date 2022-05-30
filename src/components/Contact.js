import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Platform,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import call from 'react-native-phone-call';

const Contact = ({contact, index, scrollY}) => {
  // console.log(contact);

  const QuickCall = phone => {
    // alert(phone + ' :: phone');
    let phoneNumber = phone;

    if (Platform.OS !== 'android') {
      phoneNumber = `telprompt:${phone}`;
    } else {
      phoneNumber = `tel:${phone}`;
    }
    //console.log(phoneNumber);
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
          if (!supported) {
            
          //@diabloevagto This is expected. As mentioned above, it cannot work on simulator, Apple don't allow it

          Alert.alert('Phone number is not available/valid');
        } else {
          //return Linking.openURL(phoneNumber).catch(() => null);
           return Linking.openURL(phoneNumber);
        }
      })
      .catch(err => console.log(err));
  };

  const {height} = Dimensions.get('screen');

  const inputRange = [
    -1,
    0,
    (height * 0.1 + 15) * index,
    (height * 0.1 + 15) * (index + 10),
  ];
  const scale = 1;
  const opacity = scrollY.interpolate({
    inputRange,
    outputRange: [1, 1, 1, 0],
  });
  const Offset = scrollY.interpolate({
    inputRange,
    outputRange: [0, 0, 0, 700],
  });

  return (
    <Animated.View
      style={[
        //styles.contactCon,
        {transform: [{scale: scale}, {translateX: Offset}], opacity: opacity},
      ]}>
      <TouchableOpacity
        style={styles.contactCon}
        onPress={() => QuickCall(contact?.phoneNumbers[0]?.number)}>
        <View style={styles.imgCon}>
          <View style={styles.placeholder}>
            <Text style={styles.txt}>{contact?.givenName[0]}</Text>
          </View>
        </View>
        <View style={styles.contactDat}>
          <Text style={styles.name}>
            {contact?.givenName}{' '}
            {contact?.middleName && contact.middleName + ' '}
            {contact?.familyName}
          </Text>
          <Text style={styles.phoneNumber}>
            {contact?.phoneNumbers[0]?.number || '(+000) 000 00 000'}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const {height} = Dimensions.get('screen');

const styles = StyleSheet.create({
  contactCon: {
    flex: 1,
    flexDirection: 'row',
    padding: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#d9d9d9',
  },
  imgCon: {
    height: height * 0.1,
    marginTop: 10,
    padding: 0,
    //marginHorizontal: 10,
    borderRadius: 8,
    flexDirection: 'row',
  },
  placeholder: {
    width: 55,
    height: 55,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#d9d9d9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactDat: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 5,
  },
  txt: {
    fontSize: 18,
  },
  name: {
    fontSize: 16,
  },
  phoneNumber: {
    color: '#888',
  },
});
export default Contact;
