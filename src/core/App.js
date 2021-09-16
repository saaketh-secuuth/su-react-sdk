import { getProfile } from "./Profile";
import CSX from "./CSX";
import JSX from "./JSX";
import SecAuthentication from "./Authentication";

class Secuuth {
  constructor({ keyId, profileName, containerId, onSubmit }) {
    this.profile;

    this.keyId = keyId;
    this.profileName = profileName;
    this.containerId = containerId;
    this.clientSubmit = onSubmit;
    this.auth = new SecAuthentication(this.keyId, this.profileName);
    this.#fetchForm();
  }

  #fetchForm = async () => {
    const data = await getProfile(this.keyId, this.profileName);
    const { profileMetaData } = data;
    const metaData = JSON.parse(profileMetaData);
    const profile = { ...data, profileMetaData: { ...metaData } };
    this.profile = profile;

    this.csx = new CSX(
      this.profile.profileMetaData.advancedStyling,
      this.containerId
    );
    this.csx.embedCss();

    this.#mountForm();
  };

  #mountForm = async () => {
    this.csx.injectCss();
    const jsx = JSX.getJSX(this.profile.profileMetaData);
    document.getElementById(this.containerId).innerHTML = jsx;

    document.getElementById("su-submit-btn").onclick = () =>
      this.submit().then(() => this.clientSubmit());
  };

  async submit() {
    const email = document.getElementById("suipemailp").value;

    // start progress animation
    const { profileMetaData } = await getProfile(this.keyId, this.profileName);
    const { magicLinkPromptConfig } = JSON.parse(profileMetaData);
    const { logo, subHeading, heading } = magicLinkPromptConfig;

    const mountPoint = document.getElementById(this.containerId);
    mountPoint.innerHTML += `<div class="su-overlay" id="su-overlay"><div id="su-cover-spin"></div></div>`;

    const initAuthResponse = await this.auth.initiateAuth(email, this.profile);
    let verifyAuthResp = null;
    let fetchTokens = 1;
    let authCode;

    const { challengeId, userId, challenge } = initAuthResponse;
    localStorage.setItem("challengeId", challengeId);
    localStorage.setItem("userId", userId);
    localStorage.setItem("challenge", challenge);

    if (initAuthResponse.challengeSent == "Yes") {
      document.getElementById("su-msg").innerHTML =
        "OTP/Link is sent to your Phone number/Email";

      // remove progress animation
      document.getElementById("su-overlay").remove();

      verifyAuthResp = await this.auth.verifyAuth(initAuthResponse);
      console.log(verifyAuthResp);
      if (verifyAuthResp.approved == "No") {
        fetchTokens = 0;
        document.getElementById("su-msg").innerHTML = `
              Email link is expired, please try again`;
      }
      authCode = verifyAuthResp.authCode;
    } else {
      authCode = initAuthResponse.authCode;
    }

    if (fetchTokens == 1) {
      const tokens = await this.auth.getTokens(initAuthResponse, authCode);
      const { accessToken, idToken, refreshToken } = tokens;
      if (accessToken && idToken && refreshToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("idToken", idToken);
        localStorage.setItem("refreshToken", refreshToken);
        // remove * animation
        const existingOverlay = document.getElementById("su-overlay");
        if (existingOverlay) {
          existingOverlay.remove();
        }
        mountPoint.innerHTML += `<div id="su-overlay" class="su-overlay"><img src="https://firebasestorage.googleapis.com/v0/b/charitybh-dc293.appspot.com/o/su%2Ftick.svg?alt=media&token=415b947e-2033-4768-871f-9e690d871e98" class="su-tick" width="99"/><img src="${
          logo ||
          "https://uploads-ssl.webflow.com/61234975b500ae0500a02f42/6123751c35c797119be587e3_Screenshot%20(275)%203.png"
        }" width="203"><h3>${heading}<h3/><p>${subHeading}</p></div>`;
        // add check animation.
      }
    }
  }
}

window.Secuuth = Secuuth;
