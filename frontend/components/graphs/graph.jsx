import React from 'react';
import * as d3 from 'd3';
import {connect} from 'react-redux'

class LineGraph extends React.Component {
    constructor(props){
        super(props)
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
        const margin = {top: 20, right: 20, bottom: 30, left: 50}
        const width = size[0] - margin.left - margin.right
        const height = size[1] - margin.top - margin.bottom

        // SET X and Y range.
        const x = d3.scaleLinear().range([0, width])
        const y = d3.scaleLinear().range([height, 0])

        const valueLine = d3.line()
            .x(d => x(d.day))
            .y(d => y(d.population))

        d3.select(node)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(d3.extent(data, (d) => d.day))
        y.domain([0, d3.max(data, (d) => d.population)])
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

    render() {
        return <svg ref={node => this.node = node}
        width={500} height={500}>
        </svg>
    }
}

const msp = state => {
    return {
        data: state.simData
    }
}

export default connect(msp)(LineGraph)