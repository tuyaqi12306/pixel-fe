import React, { PureComponent } from 'react'

let canvasStyle = {
  zoom: 15
}
class PixelGrid extends PureComponent {
  constructor(props) {
    super(props)
    this.canvas = null
    this.socket = this.props.socket
  }
  componentDidMount() {
    this.ctx = this.canvas.getContext('2d')
    this.canvas.style.imageRendering = 'pixelated' // canvas设置不模糊像素点样式

    this.socket.on('init-pixel-data', pixelData => {
      this.canvas.height = pixelData.length
      this.canvas.width = pixelData[0].length
      pixelData.forEach((row, rowIndex) => {
        row.forEach((color, colIdx) => {
          this.draw(rowIndex, colIdx, color)
        })
      })
    })
    this.socket.on('updata-dot', ({row, col, color}) => {
      this.draw( col, row, color)
    })
  }
  draw = (row, col ,color) => { // canvas画像素点的api
    this.ctx.fillStyle = color
    this.ctx.fillRect(row, col, 1, 1)
  }
  handleDotClick = (e) => {
    let layerX = e.nativeEvent.layerX
    let layerY = e.nativeEvent.layerY

    let row = Math.floor(layerY / 15)
    let col = Math.floor(layerX / 15)
    this.socket.emit('draw-dot', {row, col, color: this.props.currentColor})
  }
  render() {
    return (
      <div>
        <canvas
          onClick={this.handleDotClick}
          style={canvasStyle}
          ref={el => this.canvas = el}
        >
        </canvas>
      </div>
    )
  }
}

export default PixelGrid
