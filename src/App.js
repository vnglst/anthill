import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import { World, Ant, Vector } from './Ant'

const renderPheroGrid = (pheroGrid, thingGrid) => {
  return pheroGrid.space.map((column, x) => {
    const divStyle = {
      fontSize: '20px',
      lineHeight: '0px',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      whiteSpace: 'nowrap'
    }
    return <div key={x} style={divStyle}>{
        column.map((phero, y) => {
          const { food, danger, ant } = phero
          const color = `rgb(${Math.round(danger * 255)},${Math.round(food * 255)},${Math.round(ant * 255)})`
          const spanStyle = {
            margin: 0,
            padding: '20px 10px 0px 10px',
            display: 'inline-block',
            backgroundColor: color,
            width: '20px',
            height: '20px',
            overflow: 'hidden',
            whiteSpace: 'nowrap'
          }
          const thing = thingGrid.get(new Vector(x, y))
          return <span key={y} style={spanStyle}>{thing.char}</span>
        })
  }</div>
  })
}

class App extends Component {

  constructor (props) {
    super(props)
    const world = new World(10, 10)
    const ant1 = new Ant(new Vector(2, 2), world)
    const ant2 = new Ant(new Vector(5, 5), world)
    this.state = {
      world,
      ant1,
      ant2
    }
  }

  componentDidMount () {
    this.timerID = setInterval(
    () => this.tick(),
    1000
  )
  }

  componentWillUnmount () {
    clearInterval(this.timerID)
  }

  tick () {
    this.state.ant1.act()
    this.state.ant2.act()
    this.setState({
      world: this.state.world
    })
  }

  render () {
    return (
      <div className='App'>
        <div className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h2>Welcome to React</h2>
        </div>
        <p className='App-intro'>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        {renderPheroGrid(this.state.world.pheroGrid, this.state.world.thingGrid)}
        {console.log('rerender')}
      </div>
    )
  }
}

export default App
