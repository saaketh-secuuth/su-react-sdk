import React from 'react'

export default class JSX {
  constructor(fields) {
    this.fields = fields
  }

  static getJSX(profile, containerId, onSubmit) {
    const { basicStyling, advancedStyling } = profile

    const { isSms, countryCode } = basicStyling
    const {
      modalTitle,
      logo,
      btnText,
      modalTitleColor,
      modalBackgroundColor,
      btnTextColor,
      btnBgColor
    } = advancedStyling

    const signInMode = profile.signInMode
    let placeholder
    if (signInMode) {
      placeholder = `${countryCode.phone}`
    } else {
      placeholder = 'Email'
    }

    return (
      <div
        style={{
          height: '100%',
          width: '100%',
          padding: '50px 20px',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: `rgba(${modalBackgroundColor.color.r},${modalBackgroundColor.color.g},${modalBackgroundColor.color.b},${modalBackgroundColor.color.a})`,
          position: 'relative'
        }}
        id={containerId}
      >
        <img
          src={
            logo ||
            'https://uploads-ssl.webflow.com/61234975b500ae0500a02f42/6123751c35c797119be587e3_Screenshot%20(275)%203-p-500.png'
          }
          alt='logo'
          className='logo'
        />
        <div
          className='su-title'
          style={{
            color: modalTitleColor.hex || 'black'
          }}
        >
          {modalTitle}
        </div>
        <input
          type={signInMode ? `number` : `text`}
          className='su-ip-text'
          id='suipemailp'
          placeholder={placeholder}
        />
        <button
          className='su-btn'
          id='su-submit-btn'
          style={{
            backgroundColor: `rgba(${btnBgColor.color.r},${btnBgColor.color.g},${btnBgColor.color.b},${btnBgColor.color.a})`,
            color: btnTextColor.hex || 'white'
          }}
          onClick={() => onSubmit()}
        >
          {btnText}
        </button>
        <p id='su-msg'></p>
      </div>
    )
  }

  async formHTMLControls(field) {
    let content = `<div class="form-group">`
    let label, name, placeholder

    switch (field.type) {
      case 'text':
        label = field.label
        name = field.name
        placeholder = field.placeholder
        content += `
                  <label for="${name}">${label}:</label>
                  <input type="text" class="secuuth-db" id="${name}" name="${name}" placeholder="${placeholder}"/>
                `
        break
    }
    content += `</div>`
    return content
  }
}
