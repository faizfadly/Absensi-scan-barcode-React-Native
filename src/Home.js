import React, { Component } from "react";
import { StyleSheet, StatusBar, ActivityIndicator, Text, View, TouchableOpacity, ImageBackground, Alert} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import GradientHeader from "react-native-gradient-header";
import { Button } from 'native-base';

export default class Home extends Component {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#7F7FD5" barStyle="light-content" />
        <GradientHeader
          title="Attendance"
          subtitle="Institut Ummul Quro Al-Islami"
          imageSource={require('./img/logo.png')}
          gradientColors={["#7F7FD5", "#86A8E7", "#91EAE4"]}
        />
          <View style={{marginTop:'50%'}}>
            
            <Text style={{textAlign: "center"}}>
            <Icon name='qrcode' 
                size={150}
                style={{color:'#86A8E7',paddingLeft:'28%'}}
              />
            </Text>
            <Text style={styles.welcome}>Scan untuk konfimasi kehadiran</Text>
          </View>
          <View style={styles.bottom}>
          <Button rounded info small
            onPress={() => this.props.navigation.navigate("QRCodeScannerScreen")}
          >
            <Text style={{paddingLeft:10, paddingRight:10, color:'#fff'}}> Scan QRCode </Text>
          </Button>
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor:'#eee'
  },
  image: {
    marginTop: 50
  },
  welcome: {
    margin: 5,
    fontSize: 15,
    textAlign: "center",
    fontWeight:'700'
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36
  }
});
