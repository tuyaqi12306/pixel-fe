import React from 'react'
// import { NONAME } from 'dns'

let colors = ['red','orange','yellow','green','aqua','blue','purple']
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
    <ul style={{ulStyle}}>
      {
        colors.map(color => (
          <li style={{liStyle}} key={color}>
            <button onClick={() => props.onChange(color)} style={{...btnStyle,backgroundColor: color}}></button>
          </li>
        ))
      }
    </ul>
  )
}

export default ColorSelect
