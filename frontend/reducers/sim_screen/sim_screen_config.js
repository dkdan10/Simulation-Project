import { UPDATE_SIM_CONFIG } from "../../actions/sim_config_actions"
import {merge} from 'lodash'

const defaultState = {
    populationAmount: 10, 
    foodAmount: 10,
    screenSize: {
        width: 640,
        height: 420
    }
}

export default (state = defaultState, action) => {
    Object.freeze(state);

    switch (action.type) {
        case UPDATE_SIM_CONFIG:
            return merge({}, action.newConfig)
        default:
            return state
    }

}