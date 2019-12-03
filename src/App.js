import React from 'react';
import io from 'socket.io-client';
import PixelGrid from './PixelGrid'
import './App.css';

class App extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      pixelData: null
    }
  }
  componentDidMount() {
    // 获取数据 1.执行此生命周期函数dom已经生成好，可以操作dom
    let socket = io('ws://localhost:3005/') //与服务器建立连接
    socket.on('pixel-data', (data) => {
      console.log(data)
      this.setState({
        pixelData: data
      })
    })
  }
  render() {
    return (
      <div>
        <PixelGrid pixels={this.state.pixelData}></PixelGrid>
      </div>
    )
  }
}

export default App;
