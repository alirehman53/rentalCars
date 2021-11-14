import React , { Component } from 'react';
import {  StyleSheet,View, Text, Image,FlatList,TouchableOpacity,Modal,Pressable,Alert,ScrollView,SafeAreaView} from 'react-native'
import { Card,  Button,Input,Switch,Icon,Badge } from 'react-native-elements'
import axios from 'axios';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import * as SecureStore from 'expo-secure-store';
import { withRouter } from "react-router-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';




class AddUserCar extends Component {

    constructor(props){
        super(props);

        this.state = {
            car:{
                carName:"",
                model:"",
                seats:0,
                airBags:0,
                color:"",
                transmissionType:"",
                abs:false,
                ac:false,
                powerSteering:false,
                img:[],
                rentCharges:0,
                description:"",
            },
            modalVisible: false,
            mainImageView:0,
            token:"",
            
        };
        this.getValueFor = this.getValueFor.bind(this);
        this.authAlert = this.authAlert.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.handleChoosePhoto = this.handleChoosePhoto.bind(this);
        

        

    }

    authAlert = () =>
    Alert.alert(
      "Attention",
      "Login Please",
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
    
    async onAdd(){

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


            axios.post("http://192.168.100.106:5000/cars/add",this.state.car,{
            headers:{
                "x-access-token":this.state.token,
            }
           }).then(res => {
            console.log("car added");
            //this.props.history.push("/login");
            this.props.navigation.navigate('Root', { screen: 'Profile' });

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
         await this.props.navigation.navigate("Login");
        }
    }

    
    handleChoosePhoto(){
        console.log("photo handler called");
        const fn =async () => {
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64:true,
            type:true,
            
          });
      
          let imageFormat = result.uri.split('.')[result.uri.split('.').length-1];
      
          if (!result.cancelled) {
            console.log(result.base64.substring(0,20));
            this.setState((prev)=>{
              return { ...prev, car: {...prev.car, img:[...prev.car.img,'data:image/'+imageFormat+';base64,'+result.base64]},mainImageView:0};
            });
          }
        };

        fn();
      
    }


    deleteImage(index){
      console.log("image deleted : "+index);


      let images = this.state.car.img.filter(
        (image)=>{
          if(image != this.state.car.img[index])
            return image;
        }
      );

      this.setState((prev)=>{
        return { ...prev, car: {...prev.car, img:images},mainImageView:0};
      });
    }

    

    render(){
        return (
        <ScrollView style={{backgroundColor: '#F6BEFC'}}>
        <View >
            <Card containerStyle={styles.card} >
                {/* <Card.Title >
                    <Text style={{color:"#54045D",fontSize:22}} >Add Car For Rent</Text>
                </Card.Title> */}
                {this.state.car ?(
                        <View  //style={styles.user}
                        >
                        {/* {this.state.car.img &&
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
                        } */}
                        

                        {   this.state.car.img &&
                           <SafeAreaView 
                           style={this.state.car.img.length && 
                                 { borderColor:"white",
                                   borderWidth:3,
                                   borderStyle: 'dotted',
                                   borderRadius: 10, }}>
                            <FlatList 
                            horizontal={true}
                            ItemSeparatorComponent={()=><View style={styles.separator} />}
                            data={this.state.car.img}
                            renderItem={ ({ item, index, separators })=>(
                            <TouchableOpacity>
                                <Image style={styles.thumbnail} resizeMode="contain" source={{ uri:item }} minimumZoomScale={0.5} maximumZoomScale={3} />
                                <Ionicons onPress={()=>this.deleteImage(index)} style={styles.close} name="ios-close-circle" size={25} />
                            </TouchableOpacity>
                            )}
                            keyExtractor={item => item+Math.random()}
                            />
                            </SafeAreaView>

                        } 
                        <Text>{"\n\n"}</Text>

                        <Button
                            buttonStyle={{backgroundColor:"white",borderRadius: 5, marginHorizontal: 10, marginVertical:10, justifyContent:"space-evenly"}}
                            icon={<Icon name='upload' color='#54045D'  type='font-awesome' />}
                            titleStyle={{color:"#54045D"}}
                            title='Upload Images' 
                            type="outline"
                            onPress={()=>this.handleChoosePhoto()}
                        />

                      
                            <Input
                            label="Make :"
                            labelStyle={styles.text}
                            inputStyle={styles.text}
                            placeholder='Make'
                            inputContainerStyle={styles.input}
                            errorStyle={{ color: 'red' }}
                            value={this.state.car.carName}
                            onChangeText={
                                value => this.setState((prev)=>{ 
                                    return {car:{ ... prev.car, carName: value } };
                                    
                                })
                            }
                            />

                          <Input
                            label="Model :"
                            inputStyle={styles.text}
                            labelStyle={styles.text}
                            placeholder='Model'
                            value={this.state.car.model}
                            inputContainerStyle={styles.input}
                            errorStyle={{ color: 'red' }}
                            onChangeText={
                                value => this.setState((prev)=>{ 
                                    return {car:{ ... prev.car, model: value } };
                                    
                                })
                            }
                          />

                          <Input
                            label="Rent Charges :"
                            inputStyle={styles.text}
                            labelStyle={styles.text}
                            placeholder='Rent Charges'
                            keyboardType="numeric"
                            value={this.state.car?String(this.state.car.rentCharges):0}
                            inputContainerStyle={styles.input}
                            errorStyle={{ color: 'red' }}
                            onChangeText={
                                value => this.setState((prev)=>{ 
                                    return {car:{ ... prev.car, rentCharges: value } };
                                    
                                })
                            }
                            />


                          <Input
                            label="Seats :"
                            inputStyle={styles.text}
                            labelStyle={styles.text}
                            placeholder='Seats'
                            keyboardType="numeric"
                            value={this.state.car?String(this.state.car.seats):0}
                            inputContainerStyle={styles.input}
                            errorStyle={{ color: 'red' }}
                            onChangeText={
                                value => this.setState((prev)=>{ 
                                    return {car:{ ... prev.car, seats: value } };
                                    
                                })
                            }
                          />

                          <Input
                            label="Air Bags :"
                            labelStyle={styles.text}
                            inputStyle={styles.text}
                            placeholder='Air Bags'
                            keyboardType="numeric"
                            value={this.state.car?String(this.state.car.airBags):0}
                            inputContainerStyle={styles.input}
                            errorStyle={{ color: 'red' }}
                            onChangeText={
                                value => this.setState((prev)=>{ 
                                    return {car:{ ... prev.car, airBags: value } };
                                    
                                })
                            }
                          />

                          

                          <Input
                            label="Transmission Type :"
                            labelStyle={styles.text}
                            placeholder='Transmission Type'
                            inputStyle={styles.text}
                            inputContainerStyle={styles.input}
                            value={this.state.car?this.state.car.transmissionType:0}
                            errorStyle={{ color: 'red' }}
                            onChangeText={
                                value => this.setState((prev)=>{ 
                                    return {car:{ ... prev.car, transmissionType: value } };
                                    
                                })
                            }
                          />

                          <Input
                            label="Color :"
                            labelStyle={styles.text}
                            inputStyle={styles.text}
                            placeholder='Color'
                            inputContainerStyle={styles.input}
                            value={this.state.car.color}
                            errorStyle={{ color: 'red' }}
                            onChangeText={
                                value => this.setState((prev)=>{ 
                                    return {car:{ ... prev.car, color: value } };
                                    
                                })
                            }
                          />

                          <View style={styles.switchContainer}>
                            <Text style={styles.text}>Air Conditioned</Text>
                            <Switch 
                              
                              value={this.state.car.ac} 
                              color="#54045D"
                              onValueChange={
                              value => this.setState((prev)=>{ 
                                    return {car:{ ... prev.car, ac: value } };
                                })
                              }
                            />
                          </View>

                    

                          

                          <View style={styles.switchContainer}>
                            <Text style={styles.text}>ABS</Text>
                            <Switch 
                              
                              value={this.state.car.abs} 
                              color="#54045D"
                              style={{margin:0,padding:0}}
                              onValueChange={
                                  value => this.setState((prev)=>{ 
                                      return {car:{ ... prev.car, abs: value } };
                                
                                  })
                              }
                            />
                          </View>


                          <View style={styles.switchContainer}>
                            <Text style={styles.text}>Power Steering</Text>
                            <Switch 
                                
                                value={this.state.car.powerSteering} 
                                color="#54045D"
                                onValueChange={
                                value => this.setState((prev)=>{ 
                                       return {car:{ ... prev.car, powerSteering: value } }; 
                                })
                                }
                            />
                          </View>

                          <Input
                            label="Description :"
                            labelStyle={styles.text}
                            inputStyle={styles.text}
                            placeholder='Description'
                            inputContainerStyle={styles.input}
                            value={this.state.car.description}
                            multiline={true}
                            numberOfLines={3}
                            errorStyle={{ color: 'red' }}
                            onChangeText={
                                value => this.setState((prev)=>{ 
                                    return {car:{ ... prev.car, description: value } };
                                    
                                })
                            }
                          />
                        
                        <Button
                            buttonStyle={{backgroundColor:"#54045D",borderRadius: 5, marginLeft: 0, marginRight: 0, marginBottom: 0, justifyContent:"space-evenly"}}
                            title='Add Post' 
                            onPress={()=>this.onAdd()}
                        />
                        

                        
                        
                        </View>
                ):<Text>{""}</Text> }
                    
            </Card>
            
        </View>
        </ScrollView>
        );


}

}



const styles = StyleSheet.create({
    card:{
        margin:0,
        height:"100%",
        borderRadius: 10,
        backgroundColor: '#F6BEFC',
        color:"white",
        marginTop:"10%"

    },
    text:{
      color:"#54045D",
      fontSize:18,
      fontWeight:"bold"
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
      switchContainer:{
        flex:1,
        flexDirection:"row",
        justifyContent:"space-between",
        margin:10
        
      },
      input:{
        borderBottomColor:"#54045D",

    },
    close: {
      //margin: 5,
      position: "absolute",
      top: 0,
      left: 0,
      width: 25,
      height: 25,
      color: "tomato"
    },
    separator: {
      marginHorizontal:3
    }
    


  });

// export default withRouter(AddUserCar);
export default AddUserCar;