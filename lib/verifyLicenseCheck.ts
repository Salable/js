import crypto from 'crypto';

type VerifyLicenseCheckArgs = {
  publicKey: string
  signature: string
  payload: string
}

function verifyLicenseCheck({ publicKey, signature, payload }: VerifyLicenseCheckArgs) {
  const verify = crypto.createVerify('sha256');
  verify.write(payload);
  verify.end();
  return verify.verify(publicKey, signature, 'hex');
}

export { verifyLicenseCheck }
