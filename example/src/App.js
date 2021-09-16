import React from 'react'

import Secuuth from 'react-secuuth'
import 'react-secuuth/dist/index.css'

const App = () => {
  return (
    <Secuuth
      config={{
        keyId: 'a9073c80-da6d-4b65-8da7-b5ca3183195a',
        profileName: 'Default',
        containerId: 'secuuthForm',
        onSubmit: () => {
          alert('client submit')
        }
      }}
    />
  )
}

export default App
