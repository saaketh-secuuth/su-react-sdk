import React, { useState } from 'react'
import Form from './Form'
import { getProfile } from './core/API'

function Secuuth({ config }) {
  const { containerId, keyId, onSubmit, profileName } = config

  const [isProgress, setProgress] = React.useState(false)

  const clickHandler = async () => {
    const email = document.getElementById('suipemailp').value

    const { profileMetaData } = await getProfile(keyId, profileName)
    const { magicLinkPromptConfig } = JSON.parse(profileMetaData)
    const { logo, subHeading, heading } = magicLinkPromptConfig

    setProgress(true)
  }
  return (
    <div id={containerId} style={{ position: 'relative' }}>
      {isProgress ? (
        <div class='su-overlay' id='su-overlay'>
          <div id='su-cover-spin'></div>
        </div>
      ) : (
        <Form keyId={keyId} profileName={profileName} onSubmit={clickHandler} />
      )}
    </div>
  )
}

export default Secuuth
