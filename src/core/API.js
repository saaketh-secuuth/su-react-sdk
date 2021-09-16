import { HOST } from "./constants";

const getProfile = async (keyId, profileName) => {
  const profileResp = await fetch(
    `${HOST}/auth/fetchProfile?keyId=${keyId}&profileName=${profileName}`
  );
  return await profileResp.json();
};

export { getProfile };
