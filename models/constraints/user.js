export default {
  name: {
    presence: { allowEmpty: false },
    length: { minimum: 3 }
  },
  password: {
    presence: true,
    length: {
      minimum: 3,
      maximum: 6
    }
  },
  email: {
    presence: true,
    email: true
  }
}