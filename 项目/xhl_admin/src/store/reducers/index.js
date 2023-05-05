import login from './login'
import manage from './manage'

const { combineReducers } = require("redux");

export default combineReducers({
    login,
    manage
})