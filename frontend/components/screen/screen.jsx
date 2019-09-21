import React from 'react';
import { connect } from 'react-redux';
import { restartedSim } from '../../actions/config_actions';
import { finishDay } from '../../actions/day_actions';

class SimScreen extends React.Component {

    constructor(props) {
        super(props)

        const { screenSize, populationAmount, foodAmount, daySeconds } = this.props.simConfig
        
        this.timeToday = 0
        this.lengthOfDay = daySeconds * 60
        this.currentDay = 0
        this.quickSimdays = 0

        this.state = {
            autoPlay: false,
            dayFinished: false,
            simulating: false
        }
        this.controlButtonPressed = this.controlButtonPressed.bind(this)
        this.toggleAutoPlay = this.toggleAutoPlay.bind(this);
        this.printBeings = this.printBeings.bind(this);
    }

    animationLoop (interval) {
        return setInterval(() => {
            const finishedDay = this.timeToday > this.lengthOfDay
            if (this.quickSimdays > 0) {
                this.quickSimdays--
                if (this.quickSimdays === 0) {
                    this.setState({
                        autoPlay: false,
                        simulating: false
                    })
                    this.animationInterval = this.animationLoop(1000 / 60)
                }
            }

            if (this.timeToday === 0 && !this.state.simulating) {
                this.drawStillFrame()
            } else if (!finishedDay && this.state.simulating) {
                this.drawFrame()
            } else if (finishedDay && this.state.simulating && !this.state.autoPlay) {
                this.setState({ simulating: false, dayFinished: true })
                this.drawStillFrame()
            } else if (this.state.autoPlay) {
                this.controlButtonPressed()
            }

        }, interval);
    }

    componentDidMount() {
        const { screenSize, populationAmount, foodAmount, daySeconds } = this.props.simConfig
        
        this.ctx = this.canvas.getContext("2d")
        this.ctx.fillStyle = "aqua"
        this.ctx.fillRect(0, 0, screenSize.width, screenSize.height)

        clearInterval(this.animationInterval)
        this.animationInterval = this.animationLoop(1000 / 60)
    }

    componentWillUnmount() {
        this.clearInterval(this.animationInterval)
    }

    componentDidUpdate(prevProps) {
        if (this.ctx != this.canvas.getContext("2d")) {
            this.ctx = this.canvas.getContext("2d")
        }
        const { daySeconds } = this.props.simConfig

        if (this.props.simConfig.restartSim && !prevProps.simConfig.restartSim) {
            this.timeToday = 0
            this.lengthOfDay = daySeconds * 60
            this.currentDay = 0
            this.quickSimdays = 0
            this.setState({
                autoPlay: false,
                dayFinished: false,
                simulating: false
            })
            clearInterval(this.animationInterval)
            this.animationInterval = this.animationLoop(1000 / 60)
            this.props.restartedSim()
        }
    }

    drawStillFrame() {
        const {screenSize} = this.props.simConfig
        this.ctx.fillStyle = "aqua"
        this.ctx.fillRect(0, 0, screenSize.width, screenSize.height)
        this.drawBeings()
        this.drawFood()
    }

    drawFrame () {
        const {screenSize} = this.props.simConfig
        this.timeToday ++

        this.ctx.fillStyle = "aqua"
        this.ctx.fillRect(0, 0, screenSize.width, screenSize.height)
        
        this.drawBeings(true)
        this.drawFood()
    }

    drawFood() {
        this.props.food.forEach((food) => {
            food.animate(this.ctx)
        })
    }

    drawBeings(withFood) {
        this.props.beings.forEach((being) => {
            if (withFood) {
                being.animate(this.ctx, this.props.food)
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
        } else if (this.timeToday < this.lengthOfDay) {
            this.setState({simulating: true})
        } else {
            this.setupNextDay()
        }
        
    }

    setupNextDay () {
        this.props.finishDay({day: this.currentDay, beings: this.props.beings})
        this.currentDay++
        this.timeToday = 0
        this.setState({dayFinished: false})
    }

    toggleAutoPlay (e) {
        e.preventDefault()
        if (this.state.autoPlay) {
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
        return this.props.beings.sort((a, b) => {
            return a.daysSurvived > b.daysSurvived ? 1 : a.daysSurvived === b.daysSurvived ? 0 : -1
        })
    }

    printBeings () {
        this.beingsSortedByAge().forEach(b => console.log(`DaysSurvived: ${b.daysSurvived}. BabiesHad: ${b.babiesHad}. Speed: ${b.movePerFrame}. Survive: ${b.surviveChance}.` ))
    }

    quickSim(amountOfDays) {
        return e => {
            e.preventDefault()

            this.quickSimdays += amountOfDays * this.lengthOfDay
            clearInterval(this.animationInterval)
            this.animationInterval = this.animationLoop(1)    
            const cb = !this.state.simulating ? this.controlButtonPressed : null
            this.setState({
                autoPlay: true,
                simulating: true
            },
            cb)
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
                    <button onClick={this.printBeings}>Log Beings</button>

                    <button disabled={this.state.simulating || this.state.autoPlay} onClick={this.quickSim(1)}>Quick Sim 1 Days</button>
                    <button disabled={this.state.simulating || this.state.autoPlay} onClick={this.quickSim(10)}>Quick Sim 10 Days</button>
                    <button disabled={this.state.simulating || this.state.autoPlay} onClick={this.quickSim(100)}>Quick Sim 100 Days</button>
                    <button disabled={this.state.simulating || this.state.autoPlay} onClick={this.quickSim(1000)}>Quick Sim 1000 Days</button>
                </div>
                <canvas ref={(canvas) => { this.canvas = canvas }} width={screenSize.width} height={screenSize.height} />
            </>
        )
    }
}

const msp = (state) => {
    return {
        simConfig: state.simConfig,
        beings: Object.values(state.entities.beings),
        food: state.entities.food
    }
}

const mdp = (dispatch) => {
    return {
        restartedSim: () => dispatch(restartedSim()),
        finishDay: (dayData) => dispatch(finishDay(dayData))
    }
}

export default connect(msp, mdp)(SimScreen)