const express = require('express');
const cors = require('cors');
const PORT = process.env.AUTH_PORT || 8081;
const app = express();
const Steam = require('./Steam');
const { User } = require('../models');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/steam', async (req, res) => {
  try{
    const user = await Steam.authenticate(req);
    if(!user) return res.status(401).send('Unauthorized');
    let userDB = await User.findOne({ where: { steam_id: user.steamid } });
    if(!userDB) {
      userDB = await User.create({
        username: user.username,
        steam_id: user.steamid,
        avatar: user._json.avatarhash,
        profile_visibility: user._json.communityvisibilitystate
      });
    } else {
      userDB.username = user.username;
      userDB.profile_visibility = user._json.communityvisibilitystate;
      userDB.avatar = user._json.avatarhash;
      await userDB.save();
    }
    const token = await userDB.generateAuthToken();
    res.redirect(`${process.env.REDIRECT_LOGIN}?token=${token}`);
  } catch(err) {
    console.log(err);
    res.status(500).send('Internal server error');
  }
});

app.listen(PORT, () => console.log(`Auth service listening on port ${PORT}`));