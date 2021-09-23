import { CSSURL } from 'sdk-core'

export default class CSX {
  constructor(metaData, containerId) {
    this.metaData = metaData
    this.containerId = containerId
  }

  embed() {
    const head = document.getElementsByTagName('head')[0]
    head.innerHTML += `<link rel="stylesheet" href="${CSSURL}" />`

    const cryptoCore = document.createElement('script')
    cryptoCore.setAttribute(
      'src',
      'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9/core.js'
    )

    const sha256 = document.createElement('script')
    sha256.setAttribute(
      'src',
      'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9/sha256.js'
    )
    head.insertBefore(cryptoCore, head.childNodes[0])
    head.insertBefore(sha256, head.childNodes[0])
  }

  injectCss() {
    const {
      modalTitleColor,
      modalBackgroundColor,
      btnTextColor,
      btnBgColor
    } = this.metaData

    const content = `
    <style>
    #${this.containerId} {
      padding: 50px 20px;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: rgba(${modalBackgroundColor.color.r},${
      modalBackgroundColor.color.g
    },${modalBackgroundColor.color.b},${modalBackgroundColor.color.a});
      position: relative;
    }
    
    .su-btn {
      background-color: rgba(${btnBgColor.color.r},${btnBgColor.color.g},${
      btnBgColor.color.b
    },${btnBgColor.color.a});
      color: ${btnTextColor.hex || 'white'};
    }
    .su-title {
      color: ${modalTitleColor.hex || 'black'}
    }
    </style>
    `

    const head = document.getElementsByTagName('head')[0]
    head.innerHTML += content
  }
}
