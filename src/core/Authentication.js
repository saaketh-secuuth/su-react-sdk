import { getProfile } from "./API";
import { HOST } from "./constants";
import { generateKeys, timer } from "./Utilities";

export default class SecAuthentication {
  constructor(keyId, profileName) {
    this.profileName = profileName;
    this.keyId = keyId;
  }

  getTokens = async (initAuthResp, authCode) => {
    const { signInMode } = await getProfile();

    let bodyData = {
      userId: initAuthResp.userId,
      keyId: this.keyId,
      authCode: authCode,
      signInMode: signInMode,
      codeChallenge: "cc1-e5726361-23c9-4c48-a023-75e0a3723ac2",
      additionalInfo: "AdditionalInfo",
    };
    let resp = null;
    resp = await fetch(`${HOST}/auth/tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(bodyData),
    });
    return resp.json();
  };

  verifyAuth = async () => {
    const bodyData = {
      userId: localStorage.getItem("userId"),
      challengeId: localStorage.getItem("challengeId"),
      challenge: localStorage.getItem("challenge"),
    };
    console.log("bodyData", bodyData);
    let resp = null;
    let verifyResp = null;
    for (let i = 0; i < 10; i++) {
      resp = await fetch(`${HOST}/auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(bodyData),
      });
      verifyResp = await resp.json();
      if (verifyResp.approved == "Pending") {
        await timer(5000);
      } else {
        return verifyResp;
      }
    }
    return verifyResp;
  };

  initiateAuth = async (email, profile) => {
    let publicKey, privateKey;

    let keys = await generateKeys();
    publicKey = keys.publicKey.n;
    privateKey = keys.privateKey.n;
    localStorage.setItem("publicKey", publicKey);
    localStorage.setItem("privateKey", privateKey);

    const { profileId, signInMode, idType } = profile;

    const reqBody = {
      profileId: profileId,
      userPublicId: email,
      keyId: this.keyId,
      publicKey: publicKey,
      deviceType: navigator.platform,
      deviceName: navigator.userAgent,
      codeChallenge: "",
      state: "",
      signInMode: signInMode || 0,
      idType: idType || 0,
    };

    try {
      const response = await fetch(`${HOST}/auth/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(reqBody),
      });
      return await response.json();
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
}
