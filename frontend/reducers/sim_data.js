import { FINISH_DAY } from "../actions/graph_actions"
import { UPDATE_SIM_CONFIG } from "../actions/sim_config_actions"

const defaultState = []

export default (state = defaultState, action) => {
    Object.freeze(state);

    let newArray;
    switch (action.type) {
        case FINISH_DAY:
            newArray = state.slice()
            newArray.push(action.dayData)
            return newArray
        case UPDATE_SIM_CONFIG:
            newArray = []
            newArray.push({day: 0, amount: action.newConfig.populationAmount})
            return newArray
        default:
            return state
    }

}