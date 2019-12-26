import React, { Component } from 'react'

// 19-04-17 16-02-47 30-41分30秒（结果）
class Zoomable extends Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {

  }
  handleMouseWheel = () => {

  }
  render(){
    let Comp = this.props.children.type
    return <Comp
      ref={el => {
        this.canvas = el
        this.props.children.ref(el)
      }}
      {...this.props.children.prop}
      onWheel={this.handleMouseWheel}
    />
  }
}
export default Zoomable
