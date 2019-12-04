import React from 'react';
import io from 'socket.io-client';
import PixelGrid from './PixelGrid'
import ColorSelect from './ColorSelect'
import { produce } from 'immer'
import './App.css';

class App extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      pixelData: null,
      currentColor: 'red'
    }
  }
  componentDidMount() {
    // 获取数据 1.执行此生命周期函数dom已经生成好，可以操作dom
    this.socket = io('ws://localhost:3005/') //与服务器建立连接
    this.socket.on('pixel-data', (data) => {
      this.setState({
        pixelData: data
      })
    })
    this.socket.on('updata-dot', info => {
      this.setState(produce(this.state, state => {
        state.pixelData[info.row][info.col] = info.color
      }))
    })
  }
  handlePixelClick = (row, col) => {
    this.socket.emit('draw-dot', {
      row,
      col,
      color: this.state.currentColor
    })
  }
  changeCurrentColor = (color) => {
    console.log(color)
    this.setState({
      currentColor: color
    })
  }
  render() {
    return (
      <div>
        <PixelGrid onPixelClick={this.handlePixelClick} pixels={this.state.pixelData}></PixelGrid>
        <ColorSelect onChange={this.changeCurrentColor} color={this.state.currentColor}></ColorSelect>
      </div>
    )
  }
}

export default App;
