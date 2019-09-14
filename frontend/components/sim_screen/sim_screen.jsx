import React from 'react';
import { connect } from 'react-redux';
import { createFood, createBeings } from './classes/classHelpers';

class SimScreen extends React.Component {

    componentDidMount() {
        this.ctx = this.canvas.getContext("2d")
        this.ctx.fillStyle = "aqua"
        this.ctx.fillRect(0, 0, 640, 420)

        this.squarePos = {x: 0, y: 0}

        const { screenSize, populationAmount, foodAmount, daySeconds } = this.props.simConfig

        this.beings = createBeings(populationAmount, screenSize)
        this.food = createFood(foodAmount, screenSize)

        this.timeToday = 0
        this.lengthOfDay = daySeconds * 60

        this.animationInterval = setInterval(() => {
            this.drawFrame()
        }, 1000 / 60);
    }

    endDay () {
        const { screenSize } = this.props.simConfig

        this.ctx.fillStyle = "aqua"
        this.ctx.fillRect(0, 0, screenSize.width, screenSize.height)
        this.beings.forEach(being => {
            if (!being.isSafe()) {
                being.color = "black"
            }
            being.animate(this.ctx)
        })
        this.food.forEach((food) => {
            food.animate(this.ctx)
        })
    }

    drawFrame () {
        const {screenSize} = this.props.simConfig

        if (this.timeToday === this.lengthOfDay) {
            this.timeToday++
            this.endDay()
            return
        } else if (this.timeToday > this.lengthOfDay) return
        this.timeToday ++

        this.ctx.fillStyle = "aqua"
        this.ctx.fillRect(0, 0, screenSize.width, screenSize.height)
        
        this.beings.forEach((being) => {
            being.animate(this.ctx, this.food)
        })
        this.food.forEach((food) => {
            food.animate(this.ctx)
        })
    }

    componentDidUpdate (prevProps) {
        if (this.ctx != this.canvas.getContext("2d")) {
            this.ctx = this.canvas.getContext("2d")
        }
        const {foodAmount, populationAmount, daySeconds, screenSize} = this.props.simConfig
        // if (prevProps.simConfig.populationAmount !== this.props.simConfig.populationAmount) {
        //     this.food = createFood(this.props.simConfig.foodAmount)
        //     this.beings = createBeings(this.props.simConfig.populationAmount)
        // }
        // if (prevProps.simConfig.foodAmount !== this.props.simConfig.foodAmount) {
        this.timeToday = 0
        this.food = createFood(foodAmount, screenSize)
        this.beings = createBeings(populationAmount, screenSize)
        this.lengthOfDay = daySeconds * 60
        // }
    }

    render () {
        const {screenSize} = this.props.simConfig
        return (
            <>
                <div>CONTROLS GO HERE</div>
                <canvas ref={(canvas) => { this.canvas = canvas }} width={screenSize.width} height={screenSize.height} />
            </>
        )
    }
}

const msp = (state) => {
    return {
        simConfig: state.simConfig
    }
}

export default connect(msp)(SimScreen)