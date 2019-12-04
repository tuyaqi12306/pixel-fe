import React, { PureComponent } from 'react'
class PixelGrid extends PureComponent {
  constructor(props) {
    super(props)
  }
  handleDotClick = (rowIdx, colIdx) => {
    this.props.onPixelClick(rowIdx, colIdx)
  }
  render() {
    if (!this.props.pixels) {
      return null
    }else {
      return (
        <table style={{tableLayout: 'fixed'}}>
          <tbody>
            {
              this.props.pixels.map((row,rowIdx) => (
                <tr key={rowIdx}>
                  {row.map((color, colIdx) => (
                    <td
                      key={colIdx}
                      onClick={() => this.handleDotClick(rowIdx, colIdx)}
                      style={{width: '5px', height: '5px',backgroundColor: color}}
                    ></td>
                  ))}
                </tr>
              ))
            }
          </tbody>
        </table>
      )
    }
  }
}

export default PixelGrid
