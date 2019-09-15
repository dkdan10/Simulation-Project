import { UPDATE_SIM_CONFIG, RESTARTED_SIM } from "../../actions/sim_config_actions"
import {merge} from 'lodash'

const defaultState = {
    populationAmount: 10, 
    foodAmount: 10,
    screenSize: {
        width: 640,
        height: 420
    },
    daySeconds: 2,
    restartSim: false
}

export default (state = defaultState, action) => {
    Object.freeze(state);

    switch (action.type) {
        case UPDATE_SIM_CONFIG:
            return merge({}, action.newConfig)
        case RESTARTED_SIM:
            const newState = merge({}, state)
            newState.restartSim = false
            return newState
        default:
            return state
    }

}