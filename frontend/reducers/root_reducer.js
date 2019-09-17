import { combineReducers } from "redux";
// import entities from "./entities/entities_reducer";
// import session from "./session/session_reducer";
// import errors from "./errors/errors_reducer";
// import ui from "./ui/ui_reducer";
import simConfig from "./sim_screen_config"
import simData from "./sim_data"

const rootReducer = combineReducers({
    simData,
    simConfig
});

export default rootReducer;