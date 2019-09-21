import React from 'react'
import { Provider } from 'react-redux'

import SimulationScreen from './screen/screen'
import SimulationConfig from './config/config'
import LineGraph from './graphs/graph'

const App = ({store}) => (
    <Provider store={store}>
        <SimulationScreen/>
        <SimulationConfig/>
        {/* <BarChart data={[5,10,1,3]} size={[500,500]} /> */}
        <LineGraph size={[500,500]} />
    </Provider>
);

export default App;