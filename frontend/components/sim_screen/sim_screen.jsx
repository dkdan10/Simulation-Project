import React from 'react';
import { connect } from 'react-redux';
import { Being, createBeings } from './classes/classHelpers';

class SimScreen extends React.Component {

    componentDidMount() {
        this.ctx = this.canvas.getContext("2d")
        this.ctx.fillStyle = "aqua"
        this.ctx.fillRect(0, 0, 640, 420)

        this.squarePos = {x: 0, y: 0}

        this.beings = createBeings(this.props.simConfig.populationAmount)

        this.animationInterval = setInterval(() => {
            this.drawFrame()
        }, 1000);
    }

    drawFrame () {
        this.ctx.fillStyle = "aqua"
        this.ctx.fillRect(0, 0, 640, 420)
        
        this.beings.forEach((being) => {
            being.animate(this.ctx)
        })
    }

    componentDidUpdate (prevProps) {
        if (this.ctx != this.canvas.getContext("2d")) {
            this.ctx = this.canvas.getContext("2d")
        }
        if (prevProps.simConfig.populationAmount !== this.props.simConfig.populationAmount) {
            this.beings = createBeings(this.props.simConfig.populationAmount)
        }
    }

    render () {
        return (
            <canvas ref={(canvas) => {this.canvas = canvas}} width={640} height={420} />
        )
    }
}

const msp = (state) => {
    return {
        simConfig: state.simConfig
    }
}

export default connect(msp)(SimScreen)