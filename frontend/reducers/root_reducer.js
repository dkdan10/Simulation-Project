import { combineReducers } from "redux";
// import entities from "./entities/entities_reducer";
// import session from "./session/session_reducer";
// import errors from "./errors/errors_reducer";
// import ui from "./ui/ui_reducer";
import simConfig from "./sim_screen/sim_screen_config"

const rootReducer = combineReducers({
    simConfig
});

export default rootReducer;