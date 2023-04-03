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
      res.redirect(`https://transcendent-horse-5d8cb8.netlify.app/masseges.html?id=${user._id}`);
    }
  );






const passport3 = require("passport");

var GitHubStrategy = require("passport-github2").Strategy;
 
 

passport3.use(
  new GitHubStrategy(
    {
      clientID: "568155812b74c0d612c7",
      clientSecret: "6b60f85eb0c563b4227ff0697a4ac01876bf04d8",
      callbackURL: "https://zany-gray-clownfish-shoe.cyclic.app/auth/github/callback",
      scope: "user:email",
    },
    async function (accessToken, refreshToken, profile, done) {
      
      let email = profile.emails[0].value;
      await redisclient.SET(email, JSON.stringify({ "token": accessToken }));
      await redisclient.SET("email",`${email}`);
      let udata = await UserModel.findOne({ email });
      // console.log(accessToken)
      if (udata) {
        return done(null, udata);
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
      return done(null, user);
      console.log(profile);
    }
  )
);

app.get(
  "/auth/github",
  passport3.authenticate("github", { scope: ["user:email"] })
);

app.get(
  "/auth/github/callback",
  passport3.authenticate("github", {
    failureRedirect: "/login",
    session: false,
  }),
  function (req, res) {
    let user = req.user;
    res.redirect(`https://transcendent-horse-5d8cb8.netlify.app/masseges.html?id=${user._id}`);

  }
);




const FacebookStrategy = require("passport-facebook").Strategy;
const passport2 = require("passport");
 
 
 
 
 
passport2.use(
  new FacebookStrategy(
    {
      clientID: "974353840184078",
      clientSecret: "9e4fe346bfc7949f18310d215ea26b64",
      callbackURL: "https://zany-gray-clownfish-shoe.cyclic.app/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "email"],
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
      console.log(profile);
    }
  )
);




app.get(
  "/auth/facebook",
  passport2.authenticate("facebook", { scope: ["email"] })
);

app.get(
  "/auth/facebook/callback",
  passport2.authenticate("facebook", {
    failureRedirect: "/facebook/login",
    session: false,
  }),
  function (req, res) {
    let user = req.user;


    res.redirect(`https://transcendent-horse-5d8cb8.netlify.app/masseges.html?id=${user._id}`);
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
