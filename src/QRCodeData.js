import React, { Component } from "react";
import { StyleSheet, StatusBar, ActivityIndicator, Text, View, TouchableOpacity, ImageBackground, Alert} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'native-base';
import GradientHeader from "react-native-gradient-header";
export default class QRCodeData extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      qrCodeData: " ", 
      scanner: undefined,
      isLoading: true,
      showLoader:false
    };
  }

  showLoader = () => { this.setState({ showLoader:true }); };
  hideLoader = () => { this.setState({ showLoader:false }); };

  componentDidMount() {
    //The code bellow will receive the props passed by QRCodeScannerScreen
    const qrCodeData = this.props.navigation.getParam("data", "No data read");
    const scanner = this.props.navigation.getParam("scanner", () => false);
    this.setState({ qrCodeData: qrCodeData, scanner: scanner });
    this.getRemoteData(qrCodeData);
  }

  getRemoteData(code) {
    fetch("http://spmb.iuqibogor.ac.id/api/checkTagihan/", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: code
      })
    })
    .then((response) => response.json())
      .then((responseJson) => {
        //Alert.alert(JSON.stringify(responseJson.data));
        this.setState({
          isLoading: false,
          dataSource: JSON.stringify(responseJson),
        }, function(){
          // In this block you can do something with new state.
        });

      })
    .done();
  }

  saveAbsensi(){
    this.showLoader();
    fetch("http://spmb.iuqibogor.ac.id/api/absensi_kehadiran/", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.qrCodeData
      })
    })
    .then((response) => response.json())
      .then((responseJson) => {
        this.hideLoader();
        this.setState({
          isLoading: false,
          dataSource2: JSON.stringify(responseJson),
        }, function(){
          const resp = JSON.parse(this.state.dataSource2);
          const stat = resp.status;
          if(stat){
            Alert.alert('Success','Absensi berhasil');
            //SnackBar.show('Success', { duration: 8000 })
          }else{
            Alert.alert('Info','Sudah absen sebelum nya');
            //SnackBar.show('Sudah Absen', { duration: 8000 })
          }
        
        });

      })
    .done();
  }

  scanQRCodeAgain() {
    this.state.scanner.reactivate();
    this.props.navigation.goBack();
  }

  render() {
    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }
    
    const data = JSON.parse(this.state.dataSource);
    const getStatus = data.status;
    
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#7F7FD5" barStyle="light-content" />
        <GradientHeader
          title="Attendance"
          subtitle="Institut Ummul Quro Al-Islami"
          imageSource={require('./img/logo.png')}
          gradientColors={["#7F7FD5", "#86A8E7", "#91EAE4"]}
        />
        <View style={styles.navContainer}>
          {getStatus ?
            (<View>
              <View style={{marginVertical:20}}>
                <Text style={{color:'#999999',fontSize: 17, fontWeight:'700', textAlign:'center'}}>DATA CALON MAHASISWA</Text>
              </View>
              <View style={{borderBottomWidth:0.8, borderColor:'#eee', paddingBottom:5}}>
                <Text style={{color:'#999999',fontSize: 14}}>Nama</Text>
                <Text style={{fontSize: 16,fontWeight: 'bold'}}>{data.data.fullname}</Text>
              </View>
              <View style={{marginTop:10, borderBottomWidth:0.8, borderColor:'#eee', paddingBottom:5}}>
                <Text style={{color:'#999999',fontSize: 14}}>Jurusan</Text>
                <Text style={{fontSize: 16,fontWeight: 'bold'}}>{data.data.jurusan}</Text>
              </View>
              <View style={{marginTop:10, borderBottomWidth:0.8, borderColor:'#eee', paddingBottom:5}}>
                <Text style={{color:'#999999',fontSize: 14}}>Pembayaran Formulir</Text>
                <Text style={{fontSize: 16,fontWeight: 'bold'}}>{data.data.status_tagihan}</Text>
              </View>
            
              <View style={{marginTop:50}}>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <View>
                    <Button iconLeft small light 
                      style={{paddingHorizontal:10}}
                      onPress={() => this.scanQRCodeAgain()}
                    >
                      <Icon name='qrcode' />
                      <Text style={{color:'#000'}}> Scanner</Text>
                    </Button>
                  </View>
                  
                  <View>
                  {this.state.showLoader ?
                    ( <ActivityIndicator 
                        animating={this.state.showLoader} 
                        size="small"
                        color="red"
                        style={{marginTop:12, marginRight:20}}
                      />
                    )
                  :
                    (<Button iconLeft small success style={{paddingHorizontal:10}}
                      onPress={() => this.saveAbsensi()}
                    >
                      <Icon name='check'
                      color="#fff" 
                      />
                      <Text style={{color:'#fff'}}> Hadir</Text>
                    </Button>)
                  }  
                  </View>
                </View>
              </View>

            </View>)
          :
            (<View style={{backgroundColor:'#fff'}}>
              <View style={{backgroundColor: 'rgba(52, 52, 52, 0.0)',justifyContent: 'center',flex: 1,alignItems: 'center', marginTop:40}}>
                <Text style={{fontSize: 16,fontWeight: '700', alignItems:'center'}}>Data tidak ditemukan</Text>
              </View>
              <View style={{marginTop:50}}>
                <View style={{marginBottom:10}}>
                  <Button small light 
                    style={{paddingHorizontal:10}}
                    onPress={() => this.scanQRCodeAgain()}
                  >
                    <Text style={{color:'#000'}}> <Icon name='qrcode' /> Scanner</Text>
                  </Button>
                </View>
                <View>
                  <Button small success style={{paddingHorizontal:10}}
                    onPress={() => this.props.navigation.popToTop()}
                  >
                    
                    <Text style={{color:'#fff'}}> <Icon name='home' color="#fff" /> Home</Text>
                  </Button>
                </View>
              </View>
            </View>)
          }
        </View>
      </View>
    );
    
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  logo: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center'
  },
  imageContainer:{
    flex:4,
    backgroundColor:'#2196F3'
  },
  navContainer:{
    flex:1,
    backgroundColor:'#fff',
    paddingHorizontal:20,
    paddingTop:170,
    marginHorizontal:10,
    borderRadius:3,
    marginBottom:10
  },
  balanceContainer:{
    flex:2,
    backgroundColor:'#424242',
    flexDirection:'row'
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36
  }
});
