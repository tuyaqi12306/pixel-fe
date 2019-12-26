import React, { Component } from 'react'


class Moveable extends Component {
  constructor(props) {
    super(props)
  }

  handleMouseDown = (e) => {

  }

  handleMouseMove = (e) => {

  }

  handleMouseUp = (e) => {

  }

  render(){
    var Comp = this.props.children.type
    return <Comp
      {...this.props.children.props}
      onMouseDown={this.handleMouseDown}
      onMouseMove={this.handleMouseMove}
      onMouseUp={this.handleMouseUp}
    />
  }
}
