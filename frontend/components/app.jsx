import React from 'react'
import { Provider } from 'react-redux'

import SimulationScreen from './sim_screen/sim_screen'
import SimulationConfig from './sim_config/sim_config'

const App = ({store}) => (
    <Provider store={store}>
        <SimulationScreen/>
        <SimulationConfig/>
    </Provider>
);

export default App;