import React from 'react'
import JSX from './JSX'
import { CSSURL } from 'sdk-core'

function Form({ profile, onSubmit, containerId }) {
  React.useEffect(() => {
    document.getElementsByTagName('head')[0].innerHTML += `
    <link rel="stylesheet" href="${CSSURL}" />
    `
  }, [])

  return (
    <React.Fragment>
      {profile && JSX.getJSX(profile.profileMetaData, containerId, onSubmit)}
    </React.Fragment>
  )
}

export default Form
