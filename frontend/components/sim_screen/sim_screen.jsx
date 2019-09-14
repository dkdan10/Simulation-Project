import React from 'react';
import { connect } from 'react-redux';
import { createFood, createBeings, createRandomBeingPosition } from './classes/classHelpers';

class SimScreen extends React.Component {

    constructor(props) {
        super(props)

        const { screenSize, populationAmount, foodAmount, daySeconds } = this.props.simConfig
        this.timeToday = 0
        this.lengthOfDay = daySeconds * 60
        this.currentDay = 0

        this.state = {
            dayFinished: false,
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
            this.setState({ simulating: false, dayFinished: true })
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
            this.setState({
                dayFinished: false,
                simulating: false
            })
            this.drawNoMoveFrame()
        }
    }

    controlButtonPressed (e) {
        e.preventDefault()
        console.log(this.timeToday)
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
            this.setupNextDay()
        }
    }

    setupNextDay () {
        const {foodAmount, screenSize} = this.props.simConfig

        let numberDead = 0
        let numberSurvived = 0 
        for (let i = 0; i < this.beings.length; i++) {
            const being = this.beings[i];
            if (!being.isSafe()) {
                this.beings = this.beings.slice(0,i).concat(this.beings.slice(i + 1))
                i--
                numberDead++
            } else {
                // SET BEING STATE HERE
                being.color = "purple"
                being.amountEaten = 0
                being.closestFood = null
                numberSurvived++
                being.position = createRandomBeingPosition({ width: being.width, height: being.height}, being.screenSize)
            }
        }
        // DISPATCH AN ACTION THAT WILL UPDATE STATS FOR BEINGS
        console.log(`Day ${this.currentDay}: `)
        console.log(`${numberDead} Beings did not make it`)
        console.log(`${numberSurvived} Beings survived another day`)
        console.log(`${numberDead} less Beings tomorrow`)

        
        // CREATE NEW FOOD
        this.food = createFood(foodAmount, screenSize)
        this.timeToday = 0
        this.currentDay++
        this.setState({dayFinished: false})
        this.drawNoMoveFrame()
    }

    render () {
        const {screenSize} = this.props.simConfig
        const controlButtonText = this.state.simulating ? "Pause Day" : !this.state.dayFinished ? "Play Day" : "Next Day"

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