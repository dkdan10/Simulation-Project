import React from 'react'
import { Provider } from 'react-redux'

const App = ({store}) => (
    <Provider store={store}>
        <h1>Hello again!</h1>
    </Provider>
);

export default App;