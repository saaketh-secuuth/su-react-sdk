export default class JSX {
  constructor(fields) {
    this.fields = fields;
  }

  static getJSX(profile) {
    const { basicStyling, advancedStyling } = profile;

    const { isSms, countryCode } = basicStyling;
    const { modalTitle, logo, btnText } = advancedStyling;

    const signInMode = profile.signInMode;
    let placeholder;
    if (signInMode) {
      placeholder = `${countryCode.phone}`;
    } else {
      placeholder = "Email";
    }

    return `
      <img
        src="${
          logo ||
          "https://uploads-ssl.webflow.com/61234975b500ae0500a02f42/6123751c35c797119be587e3_Screenshot%20(275)%203-p-500.png"
        }"
        alt="logo"
        class="logo"
      />
      <div class="su-title">${modalTitle}</div>
      <input ${
        signInMode ? `type="number"` : `type="text"`
      }  class="su-ip-text" id="suipemailp" id="suipemailp"  placeholder="${placeholder}" />
      <button class="su-btn" id="su-submit-btn">${btnText}</button>
      <p id="su-msg"></p>
    `;
  }

  async #formHTMLControls(field) {
    let content = `<div class="form-group">`;
    let label, name, placeholder;

    switch (field.type) {
      case "text":
        label = field.label;
        name = field.name;
        placeholder = field.placeholder;
        content += `
                  <label for="${name}">${label}:</label>
                  <input type="text" class="secuuth-db" id="${name}" name="${name}" placeholder="${placeholder}"/>
                `;
        break;
    }
    content += `</div>`;
    return content;
  }
}
