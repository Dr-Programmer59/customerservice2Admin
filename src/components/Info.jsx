import React from 'react'

function Info({title,message}) {
  return (
    <div role="sucess">
  <div class="bg-blue-500 text-white font-bold rounded-t px-4 py-2">
    {title}
  </div>
  <div class="border border-t-0 border-blue-400 rounded-b bg-blue-300 px-4 py-3 text-white">
    <p>{message}</p>
  </div>
</div>
  )
}

export default Info