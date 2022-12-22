const express = require("express");
const app = express();
const cors = require("cors")
const {mongoose} = require("mongoose");
const dotenv = require("dotenv").config();
const nodemailer = require('nodemailer');

const userModel = require("./models/User");

// middleware
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://admin:admin123@userformdata.kheyeao.mongodb.net/UserData",
{useNewUrlParser: true}, ()=> {
    console.log("Connected to db !");
})



app.get("/posts", async (req, res)=> {
    userModel.find({}, (err, result)=>{
        if(err) {
            res.send(err);
        }
        res.send(result)
    })
})

app.post("/submit", async (req, res)=> {
    var username = req.body.username;
    var email = req.body.email;
    var dob = req.body.dob;
    var mobile = req.body.mobile;

    const regex = /^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/ ;

    if(!regex.test(mobile)) {
        res.send({"error":"Please enter a valid mobile number"});
    } else {

        // creating a schema object
        const newItem = new userModel({
            username: username,
            dob: dob,
            email: email,
            mobile: mobile
        })

        try {
            await newItem.save();
            
            // email code
            let mailTransporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "aka2022ak@gmail.com",
                    pass: "ykxycwilkxqcffbr"
                }
            })

            let details = {
                from: "aka2022ak@gmail.com",
                to: email,
                subject: "Congrats on Successful submition of form",
                text: "This is user info\n"
                +"Name: "+username
                +"\nDate of Birth: "+dob
                +"\nEmail: "+email
                +"\nMobile: "+mobile
            }

            await mailTransporter.sendMail(details, (err)=>{
                if(err) {
                    console.log("Error has occurred")
                } else {
                    console.log("email has been send")
                }
            })

            res.send(newItem);
        } catch (err) {
            console.log(err);
        }
    }

})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});