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
    this.socket = io('ws://localhost:3005/') //与服务器建立连接
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
        <PixelGrid currentColor={this.state.currentColor} socket={this.socket}></PixelGrid>
        <ColorSelect onChange={this.changeCurrentColor} color={this.state.currentColor}></ColorSelect>
      </div>
    )
  }
}

export default App;
