import React from 'react'
import { getProfile } from './core/API'
import JSX from './core/JSX'
import { CSSURL } from './core/constants'

function Form({ keyId, profileName, onSubmit }) {
  const [profile, setProfle] = React.useState(null)
  React.useEffect(() => {
    document.getElementsByTagName('head')[0].innerHTML += `
    <link rel="stylesheet" href="${CSSURL}" />
    `
  }, [])
  React.useEffect(() => {
    ;(async () => {
      const prof = await getProfile(keyId, profileName)
      setProfle({
        ...prof,
        profileMetaData: { ...JSON.parse(prof.profileMetaData) }
      })
    })()
  }, [keyId, profileName])

  return (
    <React.Fragment>
      {profile && JSX.getJSX(profile.profileMetaData, onSubmit)}
    </React.Fragment>
  )
}

export default Form
