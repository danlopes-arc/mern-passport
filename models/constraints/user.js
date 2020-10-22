export default {
  name: {
    presence: true,
    length: {
      minimum: 3
    }
  },
  password: {
    presence: true,
    length: {
      minimum: 3,
      maximum: 6
    }
  },
  email: {
    email: true
  }
}