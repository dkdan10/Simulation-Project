import React from 'react';
import { connect } from 'react-redux';

class SimScreen extends React.Component {

    componentDidMount() {
        this.ctx = this.canvas.getContext("2d")
        this.ctx.fillStyle = "aqua"
        this.ctx.fillRect(0, 0, 640, 420)

        this.squarePos = {x: 0, y: 0}

        this.animationInterval = setInterval(() => {
            this.drawFrame()
        }, 1000);
    }

    drawFrame () {
        this.ctx.fillStyle = "aqua"
        this.ctx.fillRect(0, 0, 640, 420)
        
        this.ctx.fillStyle = "red"
        this.ctx.fillRect(this.squarePos.x, this.squarePos.y, 10, 10)
        this.squarePos.y += 5
        this.squarePos.x += 5
    }

    componentDidUpdate () {
        if (this.ctx != this.canvas.getContext("2d")) {
            this.ctx = this.canvas.getContext("2d")
        }
        this.squarePos = { x: 0, y: 0 }
    }

    render () {
        return (
            <div>
                <canvas ref={(canvas) => {this.canvas = canvas}} width={640} height={420} />
            </div>
        )
    }
}

const msp = (state) => {
    return {
        simConfig: state.simConfig
    }
}

export default connect(msp)(SimScreen)