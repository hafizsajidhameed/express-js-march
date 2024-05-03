import passport from "passport";
import { Strategy } from "passport-local";
import {users} from '../app.js'

export default passport.use(
    new Strategy((username, displayname, done) => {
        console.log(`username ${username}`)
        console.log(`displayname ${displayname}`)
        try{
            const findUser = users.find((user) => user.username === username);
            if(!findUser) throw new Error("user not found");
            if(findUser.displayname !== displayname)
             throw new Error("invalid credentials");
            done(null, findUser);
        } catch (err) {
            done(err, null);
        }

    })
)