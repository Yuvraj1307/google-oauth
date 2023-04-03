var GoogleStrategy = require("passport-google-oauth20").Strategy;
const express=require("express")
const app=express()
const passport=require("passport")
const {connection}=require("./config/db")
 const {UserModel}=require("./models/user.schema")
const {redisclient}=require("./config/redis")
app.get("/",(req,res)=>{
res.send(req.url)
})


















// const passport = require("passport");
// require("dotenv").config();

 
const { v4: uuidv4 } = require("uuid");
passport.use(
  new GoogleStrategy(
    {
      clientID: "963616789235-ti40kvov008ok0e482jc6jutb1etjsvr.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "https://zany-gray-clownfish-shoe.cyclic.app/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      await redisclient.SET("tokens", JSON.stringify({"token":accessToken}));
      let email = profile._json.email;
      let udata = await UserModel.findOne({ email });
      if (udata) {
        return cb(null, udata);
      }
      let name = profile._json.name;
      let N = name.trim().split(" ");
      let logo = N[0][0] + N[N.length - 1][0];
      const user = new UserModel({
        name,
        logo,
        email,
        password: uuidv4(),
      });
      await user.save();
      return cb(null, user);
    }
  )
);














app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  
  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/google/login",
      session: false,
    }),
    function (req, res) {
      let user = req.user;
 // res.send("dfsdfds")
      res.redirect(`http://127.0.0.1:5502/frontend/masseges.html?id=${user._id}`);
    }
  );
app.listen(4500,async ()=>{
    try{
        await connection
        console.log(`connected to port at ${4500}`);
    }catch(err){

        console.log("its working")
        console.log(err)
    }
})
