import { combineReducers } from "redux";
import beings from "./beings_reducer";
import food from "./food_reducer";

const entitiesReducer = combineReducers({
    beings,
    food
});

export default entitiesReducer;