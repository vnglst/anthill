import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import { World, Vector } from './Ant'

const renderPheroGrid = (pheroGrid, thingGrid) => {
  return pheroGrid.space.map((column, x) => {
    const divStyle = {
      fontSize: '0px',
      lineHeight: '0px',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      whiteSpace: 'nowrap'
    }
    return <div key={x} style={divStyle}>{
        column.map((phero, y) => {
          const { food, danger, ant } = phero
          let color = `rgb(${Math.round(255 - danger * 255)},${Math.round(255 - food * 255)},${Math.round(255 - ant * 255)})`
          const thing = thingGrid.get(new Vector(x, y))
          if (thing.description === 'Ant') color = `black`
          const spanStyle = {
            margin: 0,
            padding: '0px',
            display: 'inline-block',
            backgroundColor: color,
            width: '5px',
            height: '5px',
            overflow: 'hidden',
            whiteSpace: 'nowrap'
          }
          return <span key={y} style={spanStyle} />
        })
  }</div>
  })
}

class App extends Component {

  constructor (props) {
    super(props)
    const world = new World(100, 100)
    world.createAnts(100)
    this.state = {
      world
    }
  }

  componentDidMount () {
    this.timerID = setInterval(
    () => this.tick(),
    100
  )
  }

  componentWillUnmount () {
    clearInterval(this.timerID)
  }

  tick () {
    this.state.world.turn()
    this.setState({
      ...this.state.world
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
      </div>
    )
  }
}

export default App
