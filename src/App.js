import React from 'react';
import io from 'socket.io-client';
import PixelGrid from './PixelGrid'
import ColorSelect from './ColorSelect'
import OnlineCount from './OnlineCount'
// import { produce } from 'immer'
import './App.css';
/**
 * 功能：放大，拖动，取色，限制绘制频率，在线人数，页面内实时聊天
 * 批量更新，而不是一个点一个点更新
 *
 *
 * PureComponent
 * Hooks
 * ReactDOM.createPotal 取色时用上的，一个传送门
 * socket.io
 * canvas
 * Jimp
 * lodash
 * ArrayBuffer to image
 */

class App extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      pixelData: null,
      currentColor: '#ff0000'
    }
    this.socket = io('ws://localhost:3005/') //与服务器建立连接
    // this.socket = io() //默认当前域名
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
        <PixelGrid currentColor={this.state.currentColor} socket={this.socket} onPickColor={this.changeCurrentColor}></PixelGrid>
        <div id='color-pick-placeholder'></div>
        <ColorSelect onChange={this.changeCurrentColor} color={this.state.currentColor}></ColorSelect>
        <OnlineCount socket={this.socket}/>
        {/* <ChatRoom socket={this.socket}/> */}
      </div>
    )
  }
}

export default App;
