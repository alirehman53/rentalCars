import React , { Component } from 'react';
import { Link,withRouter } from "react-router-native";
import { Header,Button } from 'react-native-elements';
import { Text, View ,StyleSheet} from 'react-native';
import * as SecureStore from 'expo-secure-store';







const NavLink = props =>{
    return (<Link to={props.link}>
            <Text style={props.style}>{props.linkName}</Text>
           </Link>);
}

const NavRightComponent = props =>{

  return (
        <View style={{flex:1,flexDirection: "row"}}>
          <NavLink style={styles.login} linkName="Login" link="/login"/>
          <NavLink style={styles.register} linkName="Register" link="/register" />
         
        </View>
  
         );
};

const LogoutComponent = props =>{

  return (
        <View style={{flex:1,flexDirection: "row"}}>
           <NavLink style={styles.name} linkName={props.name} link="/profile"/>
           <Button onPress={()=>props.removeToken()} buttonStyle={styles.logout} title="Logout"  />
        </View>
  
         );
  
};





class Navbar extends Component {
  constructor(props){
    super(props);

    this.state = {
      token:"",
      name:"",
      email:""
    };

  }

  async componentDidMount() {
    try{
    await this.props.getValueFor();
    await this.setState({token:await (await SecureStore.getItemAsync("token")).toString()});
    await this.setState({name:await (await SecureStore.getItemAsync("name")).toString() });
    await this.setState({email:await (await SecureStore.getItemAsync("email")).toString() });
    
    console.log(this.state.name);
    }catch(err){
      console.log("Logout Error :"+err.message);
    }

  }


  async removeToken(){
    try{
    await this.setState({name:"",token:"",email:""});
    await this.props.removeToken();
    }catch(err){
      console.log("Remove Token Error : "+err.message);
    }
  }


  async getValueFor() {
    try{
    let result1 = await (await SecureStore.getItemAsync("token")).toString();
    let result2 = await (await SecureStore.getItemAsync("name")).toString();
    let result3 = await (await SecureStore.getItemAsync("email")).toString();
    
    if (result1 && result2 && result3) {
      await this.setState({token:result1});
      await this.setState({name:result2});
      await this.setState({email:result3});
      await this.props.getValueFor();
    } else {
        return false;
    }
    }catch(err) {
      console.log("Err1: "+err.message);
    }
  }

  async componentDidMount() {
    try{
    let token = await this.getValueFor();
    console.log(this.state.name);
    }catch(err) {
      console.log("err3 : "+err.message);
    }



  }

   

    render(){
        return (
          
            <Header
            placement="left"
            statusBarProps={{ backgroundColor: "#54045D", }}
            containerStyle={{
                backgroundColor: "#54045D",
              }}
            leftComponent={<NavLink style={styles.appName} linkName="RentalCars" link="/" />}
            rightComponent={this.props.token == "" && this.props.name=="" ? <NavRightComponent /> : <LogoutComponent  removeToken={()=>this.removeToken()} name={this.props.name} history={this.props.history} />} 
            />

        );
    }


}


const styles = StyleSheet.create({
  appName:{
    color:"white",fontWeight:"bold",fontSize:30
  },
  register:{
    color:"white",fontSize:18,padding:5
  },
  logout:{
      backgroundColor:"#54045D",
      color:"white",
      fontSize:15,
      padding:6
  },
  login:{
    color:"white",fontSize:18,padding:5
  },
  name:{
    color:"white",fontSize:15,padding:6
  }
  
 

});

// export default withRouter(Navbar);
export default Navbar;