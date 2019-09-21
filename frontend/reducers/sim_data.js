import { FINISH_DAY } from "../actions/graph_actions"
import { UPDATE_SIM_CONFIG } from "../actions/config_actions"

const defaultState = [{day: 0, population: 10}]

export default (state = defaultState, action) => {
    Object.freeze(state);

    let newArray;
    switch (action.type) {
        case FINISH_DAY:
            newArray = state.slice()
            newArray.push({
                day: action.dayData.day,
                population: action.dayData.beings.length 
            })
            return newArray
        case UPDATE_SIM_CONFIG:
            newArray = []
            newArray.push({day: 0, population: action.newConfig.populationAmount})
            return newArray
        default:
            return state
    }

}