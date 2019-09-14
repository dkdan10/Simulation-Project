import React from 'react';
import { connect } from 'react-redux';
import { createFood, createBeings } from './classes/classHelpers';

class SimScreen extends React.Component {

    constructor(props) {
        super(props)

        const { screenSize, populationAmount, foodAmount, daySeconds } = this.props.simConfig
        this.timeToday = 0
        this.lengthOfDay = daySeconds * 60
        this.state = {
            simulating: false
        }
        this.controlButtonPressed = this.controlButtonPressed.bind(this)
        this.saveContext = this.saveContext.bind(this);
    }

    saveContext(ctx) {
        this.ctx = ctx;
    }

    componentDidMount() {
        const { screenSize, populationAmount, foodAmount, daySeconds } = this.props.simConfig
        
        this.ctx = this.canvas.getContext("2d")
        this.ctx.fillStyle = "aqua"
        this.ctx.fillRect(0, 0, screenSize.width, screenSize.height)
        
        this.beings = createBeings(populationAmount, screenSize)
        this.food = createFood(foodAmount, screenSize)

        this.drawNoMoveFrame()
    }


    drawNoMoveFrame () {
        const { screenSize } = this.props.simConfig
        let finishedDay = false
        if (this.timeToday > this.lengthOfDay) {
            this.setState({ simulating: false })
            clearInterval(this.animationInterval)
            finishedDay = true
        }

        this.ctx.fillStyle = "aqua"
        this.ctx.fillRect(0, 0, screenSize.width, screenSize.height)
        this.beings.forEach(being => {
            if (finishedDay && !being.isSafe()) {
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
            this.drawNoMoveFrame()
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

        if (populationAmount !== prevProps.simConfig.populationAmount || foodAmount !== prevProps.simConfig.foodAmount) {
            this.timeToday = 0
            this.food = createFood(foodAmount, screenSize)
            this.beings = createBeings(populationAmount, screenSize)
            this.lengthOfDay = daySeconds * 60
            this.drawNoMoveFrame()
        }
    }

    controlButtonPressed (e) {
        e.preventDefault()
        if (this.state.simulating) {
            this.setState({ simulating: false })
            clearInterval(this.animationInterval)
        } else if (this.timeToday < this.lengthOfDay) {
            this.setState({simulating: true})
            this.animationInterval = setInterval(() => {
                this.drawFrame()
            }, 1000 / 60);
        } else {
            console.log("Move To Next Day Here")
        }
    }

    render () {
        const {screenSize} = this.props.simConfig
        const controlButtonText = this.state.simulating ? "Pause Day" : this.timeToday < this.lengthOfDay ? "Play Day" : "Next Day"

        return (
            <>
                <div>
                    <button onClick={this.controlButtonPressed}>{controlButtonText}</button>
                </div>
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