import React , { Component } from 'react';
import {  StyleSheet,View, Text, Image,FlatList,TouchableOpacity,Modal,Pressable,Alert,ScrollView} from 'react-native'
import { Card,  Button, Icon } from 'react-native-elements'
import axios from 'axios';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import * as SecureStore from 'expo-secure-store';
import { withRouter } from "react-router-native";


class CarView extends Component {

    constructor(props){
        super(props);

        this.state = {
            car:{},
            id : this.props.route.params.id,
            modalVisible: false,
            mainImageView:0,
            token:"",
        };
        this.getValueFor = this.getValueFor.bind(this);
        this.authAlert = this.authAlert.bind(this);
        this.onRent = this.onRent.bind(this);
    }


    async onRent() {
      axios.post("http://192.168.100.106:5000/cars/rentRequest",
      {id:this.state.car._id},{
        headers:{
            "x-access-token":this.state.token,
        }
      }).then(async (res) => {

         await this.setState({msg:res.data});
         await this.authAlert( `After approval of request you can contact the owner of vehicle.`);
        //  await this.props.history.push(`/`);
        await this.props.navigation.navigate(`Home`);
      })
      .catch(async (err)=>{
          await this.setState({msg:err.response.data});
          await this.authAlert();
          console.log("Request Failed : "+err.response.data);
      });
      
  }

    authAlert = (msg="Login Please") =>
    Alert.alert(
      this.state.msg,
     msg
      ,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ]
    );

    async getValueFor() {
        let token = await SecureStore.getItemAsync("token");
        let result = await (token?token:"").toString();
        if (result) {
          await this.setState({token:result});
          return true;
        } else {
          this.authAlert();
          return false;
        }
    }

    async componentDidMount() {
        let token = await this.getValueFor();

        let promise = new Promise( (resolve,reject)=>{

            if (token) {
                resolve(this.state.token);
             }
             else {
                reject(Error("Token Error"));
             }

        });

        


        await promise.then((result)=>{
            console.log(result);


            axios.get("http://192.168.100.106:5000/cars/"+this.state.id,{
            headers:{
                "x-access-token":this.state.token,
            }
           }).then(res => {
            // console.log(res.data);
            const car = res.data;
            this.setState({ car });
           })
           .catch((err)=>{
             console.log(err.message);
           });

        },
         function(error) {
            console.log(error.message);
         });

        if(!token){
         //await this.props.history.push("/login");
         await this.props.navigation.navigate('Login');
        }

         
      }
    

    render(){
        return (
        
            <ScrollView key={this.state.car._id} style={{backgroundColor: '#F6BEFC',}}>
            
            <Card containerStyle={styles.card}>
                {/* <Card.Title>CARD WITH DIVIDER</Card.Title>
                <Card.Divider/> */}
        
                        <View  //style={styles.user}
                        >
                        {this.state.car.img &&
                            <View style={styles.centeredView}>
                            <Modal 
                            animationType="slide"
                            transparent={true}
                            visible={this.state.modalVisible}
                             animated
                             onRequestClose={() => {
                                Alert.alert("Modal has been closed.");
                                this.setState((prev)=>{modalVisible:!prev.modalVisible});
                              }}
                             >
                            <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                            <ReactNativeZoomableView
                            maxZoom={null}
                            minZoom={0.5}
                            zoomStep={0.5}
                            initialZoom={1}
                            bindToBorders={true}
                            captureEvent={true}
                            
                         > 
                                <Image style={{width:200,height:200}} resizeMode="contain" source={{ uri:this.state.car.img[this.state.mainImageView].Imagedata }} />
                            </ReactNativeZoomableView>
                            <Pressable
                               style={[styles.button, styles.buttonClose]}
                               onPress={() => this.setState((prev)=>({modalVisible:!prev.modalVisible}))}
                            ></Pressable>
                            </View>
                            </View>
                            </Modal>
                            </View>
                        }

                        {this.state.car.img &&
                           <TouchableOpacity onPress={()=>this.setState((prev)=>({modalVisible:!prev.modalVisible}))}>
                            <Image style={styles.image} resizeMode="contain" source={{ uri:this.state.car.img[this.state.mainImageView].Imagedata }} />
                           </TouchableOpacity>
                        } 
                        

                        {   this.state.car.img &&
                            <FlatList 
                            horizontal={true}
                            data={this.state.car.img}
                            renderItem={ ({ item, index, separators })=>(
                            <TouchableOpacity onPress={()=>this.setState({ mainImageView:index})}>
                                <Image style={styles.thumbnail} resizeMode="contain" source={{ uri:item.Imagedata }} minimumZoomScale={0.5} maximumZoomScale={3} />
                            </TouchableOpacity>
                            )}
                            keyExtractor={item => item._id}
                            />
                        }

                        <Text >
                            <Text style={styles.name}>{this.state.car.carName}</Text>{"\n"}
                            <Text style={{fontWeight:"bold"}}>Model: </Text>{this.state.car.model}{"\n"}
                            <Text style={{fontWeight:"bold"}}>Rent Charges: </Text> {this.state.car.rentCharges} <Text style={{fontWeight:"bold"}}>RS</Text> {"\n"}
                            <Text style={{fontWeight:"bold"}}>Seats: </Text> {this.state.car.seats} {"\n"}
                            <Text style={{fontWeight:"bold"}}>Air Bags: </Text> {this.state.car.airBags} {"\n"}
                            <Text style={{fontWeight:"bold"}}>Color: </Text> {this.state.car.color} {"\n"}
                            <Text style={{fontWeight:"bold"}}>Transmission Type: </Text>{this.state.car.transmissionType}{"\n"}
                            <Text style={{fontWeight:"bold"}}>Some More Specs: </Text> {(this.state.car.ac) ? "Air Conditioned ":""} 
                                                                                       {(this.state.car.abs) ? "ABS ":""} 
                                                                                       {(this.state.car.powerSteering) ? "Power Steering":""}
                                                                                       
                                                                                  
                            {"\n"}
                            <Text style={{fontWeight:"bold"}}>Description: </Text> {this.state.car.description} {"\n"}
                           
                        </Text>

                        {/* Car Owner Infomation */}
                        <Card.Divider/>
                        <Text>

                        <Text style={{fontWeight:"bold"}}>Owner: </Text> {this.state.car.ownerFirstName+" "+this.state.car.ownerLastName } {"\n"}
                        <Text style={{fontWeight:"bold"}}>Phone: </Text> {this.state.car.ownerContact} {"\n"}
                        <Text style={{fontWeight:"bold"}}>Email Address: </Text> {this.state.car.ownerEmail } {"\n"}
                        
                        </Text>
                           

                        <Button
                            icon={<Icon name='car' color='#ffffff'  type='font-awesome' />}
                            buttonStyle={{backgroundColor:"#54045D",borderRadius: 5, marginLeft: 0, marginRight: 0, marginBottom: 0, justifyContent:"space-evenly"}}
                            title='RENT NOW' 
                            onPress={()=>this.onRent()}
                        />
                        
                        </View>
                    
            </Card>
            </ScrollView>
        
        );


}

}



const styles = StyleSheet.create({
    card:{
        margin:0,
        height:"100%",
        borderRadius: 10,
        marginTop:"10%",
        backgroundColor: '#F6BEFC',
    },
    user: {
      flex: 1,
      backgroundColor: '#fff',
    },
    name:{
        fontSize:30
    }
    ,
    image:{
        width: "100%" ,
        height:250,
    },
    thumbnail:{
        width:100,
        height:100
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
    modalView: {
        width:"100%",
        height:"100%",
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      buttonOpen: {
        backgroundColor: "#F194FF",
      },
      buttonClose: {
        backgroundColor: "#2196F3",
      },



  });

// export default withRouter(CarView);
export default CarView;
