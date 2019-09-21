import { combineReducers } from "redux";
import entities from "./entities/entities_reducer";
import simConfig from "./screen_config"
import simData from "./sim_data"

const rootReducer = combineReducers({
    simData,
    simConfig,
    entities
});

export default rootReducer;