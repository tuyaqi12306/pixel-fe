import React, { Component } from 'react'
import ReactDom from 'react-dom'
import _ from 'lodash'

function createImageFromArrayBuffer(buffer) { // 将ArrayBuffer数据转化为一张图片，根据浏览器自身实现
  return new Promise((resolve) => { // 异步的，返回Promise
    let blob = new Blob([buffer], {type:'image/png'}) // Blob代表一个文件，第一个参数为数组，第二个参数是对象，type属性表示mime文件类型
    let image = new Image()
    let url = URL.createObjectURL(blob) // 为blob创建一个url
    image.onload = function() {
      resolve(image)
    }
    image.src = url
  })
}
function getMousePos(e) { // 取色功能-拿到鼠标位置
  var layerX = e.layerX
  var layerY = e.layerY
  var zoom = e.target.style.transform.match(/scale\((.*?)\)/)[1]
  return [
    Math.floor(layerX / zoom),
    Math.floor(layerY / zoom)
  ]
}

class PixelGrid extends Component {
  constructor(props) {
    super(props)
    this.state = {
      zoomLevel: 1,
      dotHoverX: -1,
      dotHoverY: -1,
      width: 0,
      height: 0,
      isPickingColor: false
    }
    this.canvas = null
    this.socket = this.props.socket
  }
  handleDotClick = (e) => { // 像素点点击变色事件
    let layerX = e.layerX
    let layerY = e.layerY
    // let layerX = e.nativeEvent.layerX
    // let layerY = e.nativeEvent.layerY
    let row = Math.floor(layerY / this.state.zoomLevel)
    let col = Math.floor(layerX / this.state.zoomLevel)
    this.socket.emit('draw-dot', {row, col, color: this.props.currentColor})
  }
  setUpZoomHandler = () => { // 鼠标滚轮放大缩小事件
    this.canvas.addEventListener('mousewheel', e => {
      let mouseLayerX = e.layerX
      let mouseLayerY = e.layerY
      let oldZoomLevel = this.state.zoomLevel
      let newZoomLevel
      if(e.deltaY < 0) {
        newZoomLevel = oldZoomLevel + 1
      }else {
        newZoomLevel = oldZoomLevel - 1
      }
      newZoomLevel = newZoomLevel < 1 ? 1 : newZoomLevel
      let a = oldZoomLevel
      let b = newZoomLevel
      let x = mouseLayerX
      let y = mouseLayerY
      let l1 = parseFloat(this.canvasWrapper.style.left)
      let t1 = parseFloat(this.canvasWrapper.style.top)
      let l2 = l1 - (b / a - 1) * x // 用transfrom属性放大
      let t2 = t1 - (b / a - 1) * y // 用transfrom属性放大
      // let l2 = (-(b / a -1) * x + l1 * a) / b // 用zoom属性放大
      // let t2 = (-(b / a -1) * y + l1 * a) / b // 用zoom属性放大

      // if (newZoomLevel < 1) {
      //   newZoomLevel = 1
      //   l2 = 0
      //   t2 = 0
      // }
      this.canvasWrapper.style.left = l2 + 'px'
      this.canvasWrapper.style.top = t2 + 'px'

      this.setState({
        zoomLevel: newZoomLevel
      })
      e.preventDefault() // 阻止滚轮时浏览器默认的滚动条事件
    })
  }
  setUpDragHandler = () => { // 鼠标拖拽事件
    let initialLeft // 初始值左边定位
    let initialTop // 初始值上边定位
    let mouseInitialX // 鼠标初始左
    let mouseInitialY // 鼠标初始上
    let mouseMoveX // 水平移动距离
    let mouseMoveY // 垂直移动距离
    let dragging = false // 是否正在拖拽
    this.canvasWrapper.addEventListener('mousedown', e => {
      initialLeft = parseFloat(this.canvasWrapper.style.left)
      initialTop = parseFloat(this.canvasWrapper.style.top)
      mouseInitialX = e.clientX
      mouseInitialY = e.clientY
      dragging = true
    })
    this.canvas.addEventListener('mousemove', e => {
      let y = Math.floor(e.layerY / this.state.zoomLevel)
      let x = Math.floor(e.layerX / this.state.zoomLevel)
      this.setState({ // 得到鼠标所在的该高亮的点的坐标
        dotHoverX: x,
        dotHoverY: y
      })
    })
    window.addEventListener('mousemove', e => {
      if (dragging) {
        let mouseX = e.clientX
        let mouseY = e.clientY
        mouseMoveX = mouseX - mouseInitialX
        mouseMoveY = mouseY - mouseInitialY
        let left = initialLeft + mouseMoveX
        let top = initialTop + mouseMoveY
        this.canvasWrapper.style.left = left + 'px'
        this.canvasWrapper.style.top = top + 'px'
      } else {

      }
    })
    window.addEventListener('mouseup', e => {
      dragging = false
    })
    this.canvasWrapper.addEventListener('mouseup', e => { //鼠标松手时应该判断该不该有点击事件
      dragging = false
      let mouseMoveDistance = Math.sqrt(mouseMoveX * mouseMoveX + mouseMoveY * mouseMoveY)
      if (mouseMoveDistance < 3 && !this.state.isPickingColor) {
        this.handleDotClick(e)
      }
    })
  }
  setUpPickColorHandler = () => { // 取色功能
    // 取色功能思路：根据鼠标移动取到鼠标位置的颜色，根据这个颜色创建出鼠标指针，再设置为canvas当前位置的鼠标指针
    function makeCursor(color) { // 得到鼠标所在位置颜色的DataURL
      let cursor = document.createElement('canvas')
      let ctx = cursor.getContext('2d')

      cursor.width = 41;
      cursor.height = 41;

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#000000';
      ctx.moveTo(0, 6);
      ctx.lineTo(12, 6);
      ctx.moveTo(6, 0);
      ctx.lineTo(6, 12);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(25, 25, 14, 0, 2 * Math.PI, false);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#000000';
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(25, 25, 13.4, 0, 2 * Math.PI, false);
      ctx.fillStyle = color;
      ctx.fill();
      return cursor.toDataURL()
      // document.getElementById('canvas').style.cursor = 'crosshair';
      // document.getElementById('canvas').style.cursor = 'url(' + cursor.toDataURL() + ') 6 6, crosshair';
    }
    this.canvas.addEventListener('mousemove', e => { // 鼠标移动时，查到鼠标所在位置颜色
      if (this.state.isPickingColor) {
        var [x, y] = getMousePos(e) // 鼠标位置
        var pixelColor = Array.from(this.ctx.getImageData(x, y, 1, 1).data) // 鼠标位置的颜色api，[x,y]位置右1，下1单位位置的颜色
        console.log('pixelColor',pixelColor)
        var pixelColorCss = 'rgba(' + pixelColor + ')' // 转为css样式，数组拼接会自动变为逗号表达式
        var cursorUrl = makeCursor(pixelColorCss)
        var temp = `url(${cursorUrl}) 6 6, crosshair`
        this.canvas.style.cursor = temp // 设置canvas上鼠标指针的颜色样式
      }
    })
    this.canvas.addEventListener('click', e => { // 点击时，拿到鼠标所在位置的颜色
      if (this.state.isPickingColor) {
        var [x, y] = getMousePos(e)
        var pixelColor = Array.from(this.ctx.getImageData(x, y, 1, 1).data)
        // 把拿到的颜色转为16进制
        var hexColor = '#' + pixelColor.slice(0,3).map(it => {
          return it.toString(16).padStart(2, '0') //字符串左边补0，宽度为2
        }).join('')
        this.props.onPickColor(hexColor)
        this.setState({
          isPickingColor: false
        })
        this.canvas.style.cursor = ''
      }
    })
  }
  setPickColor = () => { // 取色功能-设置正在取色
    this.setState({
      isPickingColor: true
    })
  }
  renderPickColorBtn = (e) => { // 取色功能-返回一个按钮
    let el = document.getElementById('color-pick-placeholder')
    if (el) {
      return ReactDom.createPortal(( // 创建一个按钮
        <button onClick={this.setPickColor}>
          { this.state.isPickingColor ? '正在取色' : '取色' }
        </button>
      ), el)
    }else {
      return null
    }
  }

  componentDidMount() {
    this.setUpZoomHandler()
    this.setUpDragHandler()
    this.setUpPickColorHandler()

    this.canvas.style.imageRendering = 'pixelated' // canvas设置不模糊像素点样式
    this.ctx = this.canvas.getContext('2d') // canvas为2d

    this.socket.on('init-pixel-data', async pixelData => { // 收到服务器端PNG图片的二进制数据
      let image = await createImageFromArrayBuffer(pixelData) // 将ArrayBuffer数据转化为一张图片
      // document.body.append(image)
      this.canvas.width = image.width
      this.canvas.height = image.height

      this.setState({
        width: image.width,
        height: image.height
      })
      this.ctx.drawImage(image, 0, 0)
      this.forceUpdate()
    })

    this.socket.on('update-dots', (dots) => {
      dots.forEach(({col, row, color}) => {
        this.drawDot(col, row, color)
      })
    })
  }
  drawDot = (row, col ,color) => { // canvas画像素点的api
    this.ctx.fillStyle = color
    this.ctx.fillRect(row, col, 1, 1)
  }
  render() {
    return (
      <div className='pixelGrid' style={{
        width: this.state.width + 'px',
        height: this.state.height  + 'px',
        position: 'relative',
        display: 'inline-block',
        margin: '120px',
        xoverflow: 'hidden',
        border: '1px solid'
      }}>
        { this.renderPickColorBtn() }
        <div className='canvas-wrapper'
          ref={(el) => this.canvasWrapper = el}
          style={{
            position: 'absolute',
            left: 0,
            top: 0
          }}
        >
          {/* span元素为一个无法交互的dot hover状态的框框 */}
          <span className='dot-hover-box' style={{
            boxShadow: '0 0 1px black',
            width: this.state.zoomLevel + 'px',
            height: this.state.zoomLevel + 'px',
            position: 'absolute',
            zIndex: 5,
            left: this.state.dotHoverX * this.state.zoomLevel + 'px',
            top: this.state.dotHoverY * this.state.zoomLevel + 'px',
            pointerEvents: 'none' // 该元素无法进行交互
          }}></span>
          <canvas
            ref={el => this.canvas = el}
            style={{
              // zoom: this.state.zoomLevel,
              transform: 'scale(' + this.state.zoomLevel + ')',
              transformOrigin: 'left top',
              display: 'block',
              boxShadow: '0px 0px 3px black',
              isPickingColor: false
            }}
            // onClick={this.handleDotClick}
          >
          {/* 不用zoom属性改用transform属性，不会影响布局 */}
          </canvas>
        </div>
      </div>
    )
  }
}

export default PixelGrid
