import React from 'react';
import { connect } from 'react-redux';
import { createFood, createBeings, createRandomBeingPosition } from './classes/classHelpers';
import Being from "./classes/being"
import Food from "./classes/food"
import { restartedSim } from '../../actions/sim_config_actions';
import { finishDay } from '../../actions/graph_actions';

class SimScreen extends React.Component {

    constructor(props) {
        super(props)

        const { screenSize, populationAmount, foodAmount, daySeconds } = this.props.simConfig
        
        this.timeToday = 0
        this.lengthOfDay = daySeconds * 60
        this.currentDay = 0

        this.state = {
            autoPlay: false,
            dayFinished: false,
            simulating: false
        }
        this.controlButtonPressed = this.controlButtonPressed.bind(this)
        this.toggleAutoPlay = this.toggleAutoPlay.bind(this);
    }

    componentDidMount() {
        const { screenSize, populationAmount, foodAmount, daySeconds } = this.props.simConfig
        
        this.ctx = this.canvas.getContext("2d")
        this.ctx.fillStyle = "aqua"
        this.ctx.fillRect(0, 0, screenSize.width, screenSize.height)
        
        this.beings = createBeings(populationAmount, screenSize)
        this.food = createFood(foodAmount, screenSize)

        this.props.finishDay({day: this.currentDay, amount: this.beings.length})
        this.drawNoMoveFrame()
    }

    componentWillUnmount() {
        this.clearInterval(this.animationInterval)
        this.clearTimeout(this.autoPlayTimeout)
    }

    componentDidUpdate(prevProps) {
        if (this.ctx != this.canvas.getContext("2d")) {
            this.ctx = this.canvas.getContext("2d")
        }
        const { foodAmount, populationAmount, daySeconds, screenSize } = this.props.simConfig

        if (this.props.simConfig.restartSim && !prevProps.simConfig.restartSim) {
            this.timeToday = 0
            this.currentDay = 0
            this.food = createFood(foodAmount, screenSize)
            this.beings = createBeings(populationAmount, screenSize)
            this.lengthOfDay = daySeconds * 60
            this.setState({
                autoPlay: false,
                dayFinished: false,
                simulating: false
            })
            this.props.restartedSim()
            this.drawNoMoveFrame()
        }
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
        this.drawBeings()
        this.drawFood()

        if (finishedDay && this.state.autoPlay) {
            this.autoPlayTimeout = setTimeout(() => {
                this.setupNextDay()
            }, 1000);
        }
    }

    drawFrame () {
        const {screenSize} = this.props.simConfig

        if (this.timeToday === this.lengthOfDay) {
            this.timeToday++
            this.drawNoMoveFrame()
            return
        } else if (!this.state.simulating) {
            clearInterval(this.animationInterval)
            return
        }
        
        this.timeToday ++

        this.ctx.fillStyle = "aqua"
        this.ctx.fillRect(0, 0, screenSize.width, screenSize.height)
        
        this.drawBeings(true)
        this.drawFood()
    }

    drawFood() {
        this.food.forEach((food) => {
            food.animate(this.ctx)
        })
    }

    drawBeings(withFood) {
        this.beings.forEach((being) => {
            if (withFood) {
                being.animate(this.ctx, this.food)
            } else {
                if (this.timeToday > this.lengthOfDay && !being.isSafe()) {
                    being.color = "black"
                }
                being.animate(this.ctx)
            }
        })
    }

    controlButtonPressed (e) {
        if (e) e.preventDefault()

        if (this.state.simulating && !this.state.autoPlay) {
            this.setState({ simulating: false })
            clearInterval(this.animationInterval)
        } else if (this.timeToday < this.lengthOfDay) {
            this.setState({simulating: true})
            this.animationInterval = setInterval(() => {
                this.drawFrame()
            }, 1000 / 60);
        } else {
            this.setupNextDay()
        }
    }

    setupNextDay () {
        const {foodAmount, screenSize} = this.props.simConfig

        let numberDead = 0
        let numberSurvived = 0 
        let totalSuriveRate = 0
        let totalSpeed = 0
        const beingsWithBaby = []
        for (let i = 0; i < this.beings.length; i++) {
            const being = this.beings[i];
            if (!being.isSafe()) {
                this.beings = this.beings.slice(0,i).concat(this.beings.slice(i + 1))
                i--
                numberDead++
            } else {
                being.daysSurvived++
                totalSpeed += being.movePerFrame
                totalSuriveRate += being.surviveChance
                // Have Baby
                if (being.amountEaten > 1) {
                    beingsWithBaby.push(being)
                }
                // SET BEING STATE HERE
                being.color = "purple"
                being.amountEaten = 0
                being.closestFood = null
                being.position = createRandomBeingPosition(being.size(), being.screenSize)
                numberSurvived++
            }
        }
        // DISPATCH AN ACTION THAT WILL UPDATE STATS FOR BEINGS
        console.log(`Day ${this.currentDay}: `)
        console.log(`${numberDead} Beings did not make it`)
        console.log(`${numberSurvived} Beings survived another day`)
        console.log(`${beingsWithBaby.length} Beings being born tomorrow`)
        console.log(`${numberSurvived + beingsWithBaby.length} Beings tomorrow`)

        while (beingsWithBaby.length) {
            const currentBeing = beingsWithBaby.shift()
            const newBaby = currentBeing.haveBaby()
            newBaby.position = createRandomBeingPosition(newBaby.size(), screenSize)
            totalSpeed += newBaby.movePerFrame
            totalSuriveRate += newBaby.surviveChance
            this.beings.push(newBaby)
        }

        console.log(`${totalSpeed / this.beings.length} Average Speed tomorrow`)
        console.log(`${totalSuriveRate / this.beings.length} Average Survive Rate tomorrow`)

        this.props.finishDay({day: this.currentDay, amount: this.beings.length})
        // CREATE NEW FOOD
        this.food = createFood(foodAmount, screenSize)
        this.timeToday = 0
        this.currentDay++
        this.setState({dayFinished: false})
        this.drawNoMoveFrame()
        if (this.state.autoPlay) {
            this.autoPlayTimeout = setTimeout(() => {
                this.controlButtonPressed()
            }, 1000);
        }
    }

    toggleAutoPlay (e) {
        e.preventDefault()
        if (this.state.autoPlay) {
            clearInterval(this.animationInterval)
            clearTimeout(this.autoPlayTimeout)
            this.setState({
                autoPlay: false,
                simulating: false
            })
        } else {
            const cb = !this.state.simulating ? this.controlButtonPressed : null
            this.setState({
                autoPlay: true,
                simulating: true
            },
            cb)
        }
    }

    beingsSortedByAge() {
        return this.beings.sort((a, b) => {
            return a.daysSurvived > b.daysSurvived ? 1 : a.daysSurvived === b.daysSurvived ? 0 : -1
        })
    }

    beingsSortedByBabies() {
        return this.beings.sort((a, b) => {
            return a.babiesHad > b.babiesHad ? 1 : a.babiesHad === b.babiesHad ? 0 : -1
        })
    }

    printBeings(sortedBy) {
        return (e) => {
            e.preventDefault()
            switch (sortedBy) {
                case "age": 
                    this.beingsSortedByAge().forEach(b => console.log(`DaysSurvived: ${b.daysSurvived}. BabiesHad: ${b.babiesHad}. Speed: ${b.movePerFrame}. Survive: ${b.surviveChance}.` ))
                    break;
                case "babies":
                    this.beingsSortedByBabies().forEach(b => console.log(`DaysSurvived: ${b.daysSurvived}. BabiesHad: ${b.babiesHad}. Speed: ${b.movePerFrame}. Survive: ${b.surviveChance}.` ))
                    break;
                default:
                    console.log(this.beingsSortedByAge())
                    break;
            }
        }
    }

    quickSim(amountOfDays) {
        return e => {
            e.preventDefault()

            this.setState({
                autoPlay: false,
                simulating: true
            }, () => {
                // SIMULATE DAY
                for (let i = 0; i < amountOfDays; i++) {
                    this.drawFood()
                    // SIM EACH 
                    for (let t = 0; t < this.lengthOfDay; t++) {
                        this.drawFrame()
                    }
                    // SETUP NEXT DAY
                    this.setupNextDay()
                }
                this.setState({
                    autoPlay: false,
                    simulating: false
                })
            })
        }
    }

    render () {
        const {screenSize} = this.props.simConfig
        const controlButtonText = this.state.simulating ? "Pause Day" : !this.state.dayFinished ? "Play Day" : "Next Day"
        const autoPlayText = this.state.autoPlay ? "Pause AutoPlay" : "Start AutoPlay"
        return (
            <>
                <div>
                    <button disabled={this.state.autoPlay} onClick={this.controlButtonPressed}>{controlButtonText}</button>
                    <button onClick={this.toggleAutoPlay}>{autoPlayText}</button>
                    <button onClick={this.printBeings("age")}>Log Beings Sort Days</button>
                    <button onClick={this.printBeings("babies")}>Log Beings Sort Babies</button>
                    <button onClick={this.printBeings()}>Log Beings</button>

                    <button disabled={this.state.simulating || this.state.autoPlay} onClick={this.quickSim(1)}>Quick Sim 1 Days</button>
                    <button disabled={this.state.simulating || this.state.autoPlay} onClick={this.quickSim(10)}>Quick Sim 10 Days</button>
                    <button disabled={this.state.simulating || this.state.autoPlay} onClick={this.quickSim(100)}>Quick Sim 100 Days</button>
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

const mdp = (dispatch) => {
    return {
        restartedSim: () => dispatch(restartedSim()),
        finishDay: (dayData) => dispatch(finishDay(dayData))
    }
}

export default connect(msp, mdp)(SimScreen)