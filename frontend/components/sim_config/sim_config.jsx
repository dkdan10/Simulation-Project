import React from 'react';
import { connect } from 'react-redux';
import { updateSimConfig } from '../../actions/sim_config_actions';

class SimConfig extends React.Component {

    constructor(props) {
        super(props)

        const { foodAmount, populationAmount, screenSize } = this.props.simConfig
        this.state = { foodAmount, populationAmount, screenSize }

        this.handleUpdateConfig = this.handleUpdateConfig.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
    }

    handleUpdateConfig (e) {
        e.preventDefault()
        const { updateSimConfig } = this.props
        const { foodAmount, populationAmount, screenSize } = this.state
        updateSimConfig({
            foodAmount: parseInt(foodAmount),
            populationAmount: parseInt(populationAmount),
            screenSize
        })
    }

    handleInputChange(field) {
        return e => {
            this.setState({ [field]: e.target.value })
        }
    }

    render() {
        const { foodAmount, populationAmount, screenSize } = this.state

        return (
            <form className="config-form" onSubmit={this.handleUpdateConfig}>
                <label>
                    Number of Creatures: 
                    <input type="number" onChange={this.handleInputChange("populationAmount")} value={populationAmount}/>
                </label>
                
                <label>
                    Amount of Food: 
                    <input type="number" onChange={this.handleInputChange("foodAmount")} value={foodAmount}/>
                </label>
                <input type="submit" value="Update Config" />
            </form>
        )
    }
}

const msp = (state) => {
    return {
        simConfig: state.simConfig
    }
}

const mdp = (dispatch) => {
    return {
        updateSimConfig: (newConfig) => dispatch(updateSimConfig(newConfig)),
    }
}

export default connect(msp, mdp)(SimConfig)