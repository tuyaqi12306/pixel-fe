import React, { Component } from 'react'
function PixelGrid(props) {
  if (!props.pixels) {
    return null
  }else {
    return (
      <table>
        {
          props.pixels.map(row => (
            <tr>
              {row.map(color => (
                <td style={{width: '5px', height: '5px',backgroundColor: color}}></td>
              ))}
            </tr>
          ))
        }
      </table>
    )
  }
}

export default PixelGrid
