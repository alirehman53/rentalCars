const router = require('express').Router();
const auth = require("../middleware/auth");
let User = require('../models/user.model');
let Car = require('../models/car.model');
let RentRequest = require('../models/carRentRequest.model');

router.route("/welcome").get(auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");

});

router.route('/').get( (req,res)=>{
    console.log("request received");
    Car.find()
        .then(cars => {
        
            let objCar = [];

           for(let i=0;i<cars.length;i++){
               console.log(cars[i].carName+"  "+cars[i]._id+"\n");
               objCar.push( {
                _id:cars[i]._id,
                carName:cars[i].carName,
                model:cars[i].model,
                seats:cars[i].seats,
                airBags:cars[i].airBags,
                color:cars[i].color,
                transmissionType:cars[i].transmissionType,
                abs:cars[i].abs,
                ac:cars[i].ac,
                powerSteering:cars[i].powerSteering,
                img:[],
                rentCharges:cars[i].rentCharges,
                description:cars[i].description,
                owner:cars[i].owner
          } ); 

               for(let j=0;j<cars[i].img.length;j++){

                objCar[i].img.push({ 
                      _id: cars[i].img[j]._id,
                      Imagedata:cars[i].img[j].contentType+","+cars[i].img[j].data.toString("base64"),
                    });
            }
               
           }
           
            return res.json(objCar);

        }
            )
        .catch(err => res.status(400).json('Error: '+err));
});



router.route('/userVehicles').get(auth, (req,res)=>{
    console.log("owner vehicles request received");

    Car.where({owner: req.user.user_id })
        .then(cars => {
            let objCar = [];
           for(let i=0;i<cars.length;i++){
               console.log(cars[i].carName+"  "+cars[i]._id+"\n");
               objCar.push( {
                _id:cars[i]._id,
                carName:cars[i].carName,
                model:cars[i].model,
                seats:cars[i].seats,
                airBags:cars[i].airBags,
                color:cars[i].color,
                transmissionType:cars[i].transmissionType,
                abs:cars[i].abs,
                ac:cars[i].ac,
                powerSteering:cars[i].powerSteering,
                img:[],
                rentCharges:cars[i].rentCharges,
                description:cars[i].description,
                owner:cars[i].owner
          } ); 

               for(let j=0;j<cars[i].img.length;j++){

                objCar[i].img.push({ 
                      _id: cars[i].img[j]._id,
                      Imagedata:cars[i].img[j].contentType+","+cars[i].img[j].data.toString("base64"),
                    });
            }
               
           }
           
            return res.json(objCar);

        }
            )
        .catch(err => res.status(400).json('Error: '+err));
});

router.route('/add').post(auth,(req,res)=>{
    //console.log(req.body);
    // req.user.user_id

    const carName = req.body.carName;
    const model= req.body.model;
    const seats= Number(req.body.seats);
    const airBags= Number(req.body.airBags);
    const color = req.body.color;
    const transmissionType= req.body.transmissionType;
    const abs= Boolean(req.body.abs);
    const ac= Boolean(req.body.ac);
    const powerSteering = Boolean(req.body.powerSteering);
    let img =  [];
    const rentCharges = 5000;
    let description="";

    for(let i=0;i<req.body.img.length;i++){
        img.push({  data :new Buffer.from(req.body.img[i].split(",")[1], 'base64'),
                    contentType:req.body.img[i].split(",")[0]
                });
    }

    if(  req.body.description){
         description= req.body.description;
    }

    const newCar  = new Car({
        carName,
        model,
        seats,
        airBags,
        color,
        transmissionType,
        abs,
        ac,
        powerSteering,
        img,
        rentCharges,
        description,
        owner:req.user.user_id,
    });

    return newCar.save()
    .then(()=>res.json('Car added!'))
    .catch(err => res.status(400).json("Error: "+err));

});


router.route('/:id').get(auth,(req,res)=>{
    
    Car.findById(req.params.id)
    .then(car=>{

        return User.findById(car.owner)
        .then(user=>{

            
            let objCar ={
                _id:car._id,
                carName:car.carName,
                model:car.model,
                seats:car.seats,
                airBags:car.airBags,
                color:car.color,
                transmissionType:car.transmissionType,
                abs:car.abs,
                ac:car.ac,
                powerSteering:car.powerSteering,
                img:[],
                rentCharges:car.rentCharges,
                description:car.description,
                ownerEmail:user.email,
                ownerContact:user.contact,
                ownerFirstName:user.first_name,
                ownerLastName:user.last_name,

        } ; 

        for(let j=0;j<car.img.length;j++){

            objCar.img.push({ 
                  _id: car.img[j]._id,
                  Imagedata:car.img[j].contentType+","+car.img[j].data.toString("base64"),
                });
        }
       
       
        return res.json(objCar);


        })
        .catch(err => res.status(400).json('Error: '+err));
        


        
    })
    .catch(err => res.status(400).json('Error: '+err));
});


router.route('/:id').delete((req,res)=>{

    Car.findByIdAndDelete(req.params.id)
    .then(()=>res.json("Car deleted."))
    .catch(err => res.status(400).json('Error: '+err));

});

router.route('/update/:id').post((req,res)=>{

    Car.findById(req.params.id)
    .then(async (car) =>{

        let imageArray = [];

        car.carName = req.body.carName;
        car.model= req.body.model;
        car.seats= Number(req.body.seats);
        car.airBags= Number(req.body.airBags);
        car.color = req.body.color;
        car.transmissionType= req.body.transmissionType;
        car.abs= Boolean(req.body.abs);
        car.ac= Boolean(req.body.ac);
        car.powerSteering = Boolean(req.body.powerSteering);
        car.description = req.body.description;
       

        for(let j=0;j<req.body.img.length;j++){
            imageArray.push({ data :new Buffer.from(req.body.img[j].Imagedata.split(",")[1], 'base64'),contentType:req.body.img[j].Imagedata.split(",")[0]});
        }


        car.img = imageArray;
        
        await car.save()
        .then(()=>res.json('Car updated!'))
        .catch(err => res.status(400).json("Error: "+err));

    })
    .catch(err => res.status(400).json('Error: '+err));


});




router.route('/addCarImages').post(auth,(req,res)=>{
    

    Car.findById(req.body.id)
    .then(car =>{
        
        let images = [];
        for(let i=0;i<req.body.images.length;i++){
            images.push({ data :new Buffer.from(req.body.images[i].split(",")[1], 'base64'),contentType:req.body.images[i].split(",")[0]});
        }

        car.img = car.img.concat(images);

        car.save()
        .then(()=>res.json('Images Added!'))
        .catch(err => res.status(400).json("Error: "+err));
    })
    .catch(err => res.status(400).json('Error: '+err));
   
});




router.route('/rentRequest').post(auth,(req,res)=>{

    // req.user.user_id

    Car.findById(req.body.id)
    .then(car =>{

        if(req.user.user_id ==  car.owner){
            return res.status(400).json("You cannot send request for vehicle you own.")
        }

        RentRequest.where({
            carID:car._id,
            applicantID:req.user.user_id,
            ownerID: car.owner,
        })
        .then(rentReq=>{
            console.log(rentReq);


            
            if(rentReq.length){
                console.log("Request Already Sent!");
                return res.status(400).json("Request Already Sent!");
            }else{
                const newRentRequest  = new RentRequest({
                    carID:car._id,
                    ownerID: car.owner,
                    applicantID:req.user.user_id,
                });
                
            
                newRentRequest.save()
                .then(()=>res.json('Request Sent!'))
                .catch(err => res.status(400).json("Error: "+err));
        
            }
        })
        .catch(err=> {
            console.log(err);
        });
    })
    .catch(err => res.status(400).json('Error: '+err));
   
});


router.route('/rentConfirmation').post(auth,(req,res)=>{
    // req.user.user_id

    RentRequest.where({
        _id:req.body.id,
        ownerID:req.user.user_id
    })
    .then(rentReq =>{
        rentReq[0].confirmation = true;
        
        rentReq.save()
        .then(()=>res.json('Vehicle rent confirmation sent to the applicant!'))
        .catch(err => res.status(400).json("Error: "+err));
    })
    .catch(err => res.status(400).json('Error: '+err));
});


router.route('/rentReqStatus').get(auth,(req,res)=>{
    // req.user.user_id

    RentRequest.where({
        applicantID:req.user.user_id
    })
    .then(rentReq =>{
       return res.status(200).json(rentReq);
    })
    .catch(err => res.status(400).json('Error: '+err));
});

router.route('/rentalVehicles').get(auth,(req,res)=>{
    console.log("hello");
    // req.user.user_id

    RentRequest.where({
        applicantID:req.user.user_id,
        confirmation:true
    })
    .then(rentalVehicles =>{
       //return res.status(200).json(rentalVehicles);
       console.log(rentalVehicles.length);

       let userRentalvehicle = [];

       for(let j=0;j<rentalVehicles.length;j++){
           let objCar = {};
        User.findById(rentalVehicles[j].ownerID)
        .then(user=>{

            Car.findById(rentalVehicles.carID)
               .then(car=>{

                objCar ={
                    _id:car._id,
                    carName:car.carName,
                    model:car.model,
                    seats:car.seats,
                    airBags:car.airBags,
                    color:car.color,
                    transmissionType:car.transmissionType,
                    abs:car.abs,
                    ac:car.ac,
                    powerSteering:car.powerSteering,
                    img:[],
                    rentCharges:car.rentCharges,
                    description:car.description,
                    ownerEmail:user.email,
                    ownerContact:user.contact,
                    ownerFirstName:user.first_name,
                    ownerLastName:user.last_name,
    
            } ; 
    
                for(let i=0;i<car.img.length;i++){
    
                    objCar.img.push({ 
                        _id: car.img[i]._id,
                        Imagedata:car.img[i].contentType+","+car.img[i].data.toString("base64"),
                    });
                }

                userRentalvehicle.push(objCar); 
            

            }).catch(err => res.status(400).json('Error: '+err));


        })
        .catch(err => res.status(400).json('Error: '+err));

       }
       console.log("rental vehicle");

       return res.status(200).json(userRentalvehicle);


       
    })
    .catch(err => res.status(400).json('Error: '+err));
});















module.exports = router;