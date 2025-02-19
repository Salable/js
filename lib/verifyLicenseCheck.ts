type VerifyLicenseCheckArgs = {
  publicKey: string
  signature: string
  payload: string
}

function importPublicKey(pem: string) {
  const pemContents = pem.replace(/-{5}.*?-{5}|\s/gm, '');

  const binaryDerString = window.atob(pemContents);
  const binaryDer = str2ab(binaryDerString);

  return window.crypto.subtle.importKey(
    "spki",
    binaryDer,
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    true,
    ["verify"],
  );
}

function str2ab(str: string) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function hexStringToUint8Array(hexString: string) {
  const result = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
    result[i / 2] = parseInt(hexString.substring(i, i + 2), 16);
  }
  return result;
}

async function verifyLicenseCheck({ publicKey: publicKeyPem, signature, payload }: VerifyLicenseCheckArgs) {
  const publicKey = await importPublicKey(publicKeyPem);
  const rawSignature = hexStringToUint8Array(signature);

  const isVerified = await window.crypto.subtle.verify(
    {
      name: 'ECDSA',
      hash: { name: 'SHA-256' }
    },
    publicKey,
    rawSignature.buffer,
    new TextEncoder().encode(payload)
  );

  return isVerified
}

export { verifyLicenseCheck }