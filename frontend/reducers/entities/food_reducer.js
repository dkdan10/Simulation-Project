import { createFood } from "../../components/classes/classHelpers";
import { UPDATE_SIM_CONFIG } from "../../actions/config_actions";
import { FINISH_DAY } from "../../actions/day_actions";

let screenSize = {
    width: 640,
    height: 420
}
let foodAmount = 10
const defaultState = createFood(10, screenSize)
export default (state = defaultState, action) => {
    Object.freeze(state);
 
    switch (action.type) {
        case UPDATE_SIM_CONFIG:
            foodAmount = action.newConfig.foodAmount
            screenSize = action.newConfig.screenSize
            return createFood(foodAmount, screenSize)
        case FINISH_DAY:
            return createFood(foodAmount, screenSize)
        default:
            return state
    }

}