import React from 'react'
function PixelGrid(props) {
  if (!props.pixels) {
    return null
  }else {
    return (
      <table style={{tableLayout: 'fixed'}}>
        <tbody>
          {
            props.pixels.map((row,rowIdx) => (
              <tr key={rowIdx}>
                {row.map((color, colIdx) => (
                  <td
                    key={colIdx}
                    onClick={() => props.onPixelClick(rowIdx, colIdx)}
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

export default PixelGrid
