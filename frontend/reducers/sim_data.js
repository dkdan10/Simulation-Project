import { FINISH_DAY } from "../actions/day_actions"
import { UPDATE_SIM_CONFIG } from "../actions/config_actions"

// const defaultState = [{
//     day: 0,
//     population: 10,
//     averageSpeed: 4,
//     topSpeed: 4,
//     averageSurvivalChance: 0.5,
//     topSurvivalChance: 0.5,
//     numberDead: 0,
//     numberBorn: 0
// }]

export default (state = [], action) => {
    Object.freeze(state);

    let newArray;
    switch (action.type) {
        case FINISH_DAY:
            newArray = state.slice()
            newArray.push(action.graphData)
            return newArray
        case UPDATE_SIM_CONFIG:
            newArray = []
            return newArray
        default:
            return state
    }

}