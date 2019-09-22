import React from 'react';
import * as d3 from 'd3';
import {connect} from 'react-redux'

class LineGraph extends React.Component {
    constructor(props){
        super(props)
        this.state = {yAxis: "startingPopulation", xAxis: "day"}
        this.createBarChart = this.createBarChart.bind(this)
    }
    componentDidMount() {
        this.createBarChart()
    }
    componentDidUpdate() {
        this.createBarChart()
    }
    createBarChart() {
        const node = this.node
        d3.select(node).selectAll("*").remove();

        const {data, size} = this.props
        const {xAxis, yAxis} = this.state
        const margin = {top: 20, right: 20, bottom: 30, left: 50}
        const width = size[0] - margin.left - margin.right
        const height = size[1] - margin.top - margin.bottom

        // SET X and Y range.
        const x = d3.scaleLinear().range([0, width])
        const y = d3.scaleLinear().range([height, 0])

        const valueLine = d3.line()
            .x(d => x(d[xAxis]))
            .y(d => y(d[yAxis]))

        d3.select(node)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(d3.extent(data, (d) => d[xAxis]))
        y.domain([0, d3.max(data, (d) => d[yAxis])])
        // y.domain(d3.extent(data, (d) => d.population))

        d3.select(node)
            .append("path")
            .data([data])
            .attr("transform", "translate (" + margin.left + ", 0)")
            .attr("class", "line")
            .attr("d", valueLine)

        d3.select(node)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + height + ")")
            .call(d3.axisBottom(x))

        d3.select(node)
            .append("g")
            .attr("transform", "translate (" + margin.left + ", 0)")
            .call(d3.axisLeft(y))

    }

    changeAxis(axis) {
        return e => {
            e.preventDefault()
            this.setState({[axis]: e.target.value});
        }
      }

    render() {
        return (
            <div className="graph-display">
                <svg ref={node => this.node = node}
                    width={500} height={500}>
                </svg>
                <div className="graph-options">
                    Y-Axis:
                    <select value={this.state.yAxis} onChange={this.changeAxis("yAxis")}>
                        <option value="day">Day</option>
                        <option value="startingPopulation">Start Population</option>
                        <option value="endingPopulation">End Population</option>
                        <option value="averageSpeed">Average Speed</option>
                        <option value="topSpeed">Top Speed</option>
                        <option value="averageSurvivalChance">Average Survival Chance</option>
                        <option value="topSurvivalChance">Top Survival Chance</option>
                        <option value="numberDead">Number Dead</option>
                        <option value="numberBorn">Number Born</option>
                    </select>
                    X-Axis:
                    <select value={this.state.xAxis} onChange={this.changeAxis("xAxis")}>
                        <option value="day">Day</option>
                        <option value="startingPopulation">Start Population</option>
                        <option value="endingPopulation">End Population</option>
                        <option value="averageSpeed">Average Speed</option>
                        <option value="topSpeed">Top Speed</option>
                        <option value="averageSurvivalChance">Average Survival Chance</option>
                        <option value="topSurvivalChance">Top Survival Chance</option>
                        <option value="numberDead">Number Dead</option>
                        <option value="numberBorn">Number Born</option>
                    </select>
                </div>
            </div>
        )
    }
}

const msp = state => {
    return {
        data: state.simData
    }
}

export default connect(msp)(LineGraph)