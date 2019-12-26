import React, { useState } from 'react'

function useOnlineCount(socket) {
  let [count, setCount] = useState(0)
  socket.on('online-count', setCount)
  return count
}
function OnlineCount({socket}) {
  let count = useOnlineCount(socket)
  return <div>在线人数：{ count }</div>
}

export default OnlineCount
