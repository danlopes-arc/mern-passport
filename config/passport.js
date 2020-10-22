import jwt from 'passport-jwt'

import User from '../models/User.js'

export default function (passport) {

  const options = {
    jwtFromRequest: jwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  }

  passport.use(new jwt.Strategy(options,
    async (decodedToken, done) => {
      try {
        const user = await User.findById(decodedToken.id)

        if (user == null) {
          done(null, false)
        }
        return done(null, user)

      } catch (err) {
        console.error('[server] jwt validation error', err)
        return done(err)
      }
    })
  )
}