import React from 'react'
// import { NONAME } from 'dns'

let colors = ['#ffffff','#000000','#ff0000','#ffa500','#ffff00','#00ff00','#00ffff','#0000ff','#800080']
let ulStyle = {
  margin: 0,
  padding: 0,
  listStyle: 'none'
}
let liStyle = {
  float: 'left',
  listStyle: 'none'
}
let btnStyle = {
  width: '1em',
  height: '1em'
}
function ColorSelect(props) {
  return (
    <div>
      <ul style={ulStyle}>
        {
          colors.map(color => (
            <li style={liStyle} key={color}>
              <button onClick={() => props.onChange(color)} style={{...btnStyle,backgroundColor: color}}></button>
            </li>
          ))
        }
      </ul>
      <input type='color' value={props.color} onChange={(e) => props.onChange(e.target.value)}></input>
    </div>
  )
}

export default ColorSelect
