import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import validate from 'validate.js'

import User from '../../models/User.js'
import constraints from '../../models/constraints/user.js'
import { emptyToString, emptyToNull } from '../../models/constraints/utils.js'

const router = express.Router()

router.post('/register', async (req, res) => {
  let { name, password, email } = req.body

  email = emptyToNull(emptyToString(email).trim().toLowerCase())
  name = emptyToNull(emptyToString(name))
  password = emptyToNull(emptyToString(password))

  const errors = validate({ name, password, email }, constraints)

  if (errors) {
    return res.status(400).json(errors)
  }


  try {
    const user = await User.findOne({ email })
    if (user != null) {
      return res.status(400).json({ email: ['Email already exists'] })
    }

    const hash = await bcrypt.hash(password, 12)
    const newUser = await new User({ name, email, hash }).save()

    return res.json(newUser.info)

  } catch (err) {
    console.error('[server][error] user register', err)
    return res.sendStatus(500)
  }
})

router.post('/login', async (req, res) => {

  let { password, email } = req.body
  email = emptyToNull(emptyToString(email).trim().toLowerCase())
  password = emptyToNull(emptyToString(password))

  try {
    const user = await User.findOne({ email })

    if (user == null) {
      return res.status(404).json({ email: ['Email does not exist'] })
    }

    const passwordMatches = await bcrypt.compare(password, user.hash)

    if (!passwordMatches) {
      return res.status(400).json({ password: ['Wrong password'] })
    }

    const payload = {
      id: user._id
    }

    jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h'
    },
      (err, token) => {
        if (err) {
          throw new Error('jwt sign')
        }

        return res.json({
          bearer: `Bearer ${token}`,
          user: user.info
        })
      })

  } catch (err) {
    console.error('[server][error] user login', err)
    return res.sendStatus(500)
  }
})

router.get('/myinfo', passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    return res.json(req.user.info)
  })

export default router