import React from 'react'
import Form from './Form'
import { getProfile, SecAuthentication } from 'sdk-core/'

function Secuuth({ config }) {
  const { containerId, keyId, onSubmit, profileName } = config
  const [profile, setProfle] = React.useState(null)

  React.useEffect(() => {
    ;(async () => {
      const prof = await getProfile(keyId, profileName)
      setProfle({
        ...prof,
        profileMetaData: { ...JSON.parse(prof.profileMetaData) }
      })
    })()
  }, [keyId, profileName])

  const clickHandler = async () => {
    const email = document.getElementById('suipemailp').value

    const { profileMetaData } = profile
    const { magicLinkPromptConfig } = profileMetaData

    const { logo, subHeading, heading } = magicLinkPromptConfig

    const mountPoint = document.getElementById(containerId)
    mountPoint.innerHTML += `<div class="su-overlay" id="su-overlay"><div id="su-cover-spin" style='position: relative; '></div></div>`

    const auth = new SecAuthentication(keyId, profileName)
    const initAuthResponse = await auth.initiateAuth(email, profile)
    let verifyAuthResp = null
    let fetchTokens = 1
    let authCode

    const { challengeId, userId, challenge } = initAuthResponse
    localStorage.setItem('challengeId', challengeId)
    localStorage.setItem('userId', userId)
    localStorage.setItem('challenge', challenge)

    if (initAuthResponse.challengeSent == 'Yes') {
      document.getElementById('su-msg').innerHTML =
        'OTP/Link is sent to your Phone number/Email'

      // remove progress animation
      document.getElementById('su-overlay').remove()

      verifyAuthResp = await auth.verifyAuth(initAuthResponse)
      console.log(verifyAuthResp)
      if (verifyAuthResp.approved == 'No') {
        fetchTokens = 0
        document.getElementById('su-msg').innerHTML = `
              Email link is expired, please try again`
      }
      authCode = verifyAuthResp.authCode
    } else {
      authCode = initAuthResponse.authCode
    }

    if (fetchTokens == 1) {
      const tokens = await auth.getTokens(initAuthResponse, authCode)
      const { accessToken, idToken, refreshToken } = tokens
      if (accessToken && idToken && refreshToken) {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('idToken', idToken)
        localStorage.setItem('refreshToken', refreshToken)
        // remove * animation
        const existingOverlay = document.getElementById('su-overlay')
        if (existingOverlay) {
          existingOverlay.remove()
        }
        mountPoint.innerHTML += `<div id="su-overlay" class="su-overlay"><img src="https://firebasestorage.googleapis.com/v0/b/charitybh-dc293.appspot.com/o/su%2Ftick.svg?alt=media&token=415b947e-2033-4768-871f-9e690d871e98" class="su-tick" width="99"/><img src="${
          logo ||
          'https://uploads-ssl.webflow.com/61234975b500ae0500a02f42/6123751c35c797119be587e3_Screenshot%20(275)%203.png'
        }" width="203"><h3>${heading}<h3/><p>${subHeading}</p></div>`
        // add check animation.
      }
    }
  }

  return (
    <Form profile={profile} onSubmit={clickHandler} containerId={containerId} />
  )
}

export default Secuuth
