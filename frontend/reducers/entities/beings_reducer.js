import { createBeings } from "../../components/classes/classHelpers";
import { UPDATE_SIM_CONFIG } from "../../actions/config_actions";
import { FINISH_DAY } from "../../actions/day_actions";
import {merge} from "lodash"

const screenSize = {
    width: 640,
    height: 420
}
const defaultState = createBeings(10, screenSize)

export default (state = defaultState, action) => {
    Object.freeze(state);
 
    switch (action.type) {
        case UPDATE_SIM_CONFIG:
            return createBeings(action.newConfig.populationAmount, action.newConfig.screenSize)
        case FINISH_DAY:
            let newState = merge({}, state)
            action.deadIds.forEach(id => delete newState[id])
            action.babyIds.forEach(id => {
                const baby = newState[id].haveBaby()
                newState[baby.id] = baby
            })
            return newState
        default:
            return state
    }

}