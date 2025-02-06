import { describe, it, expect } from 'vitest'
import 'vitest-fetch-mock'
import { verifyLicenseCheck } from 'lib/verifyLicenseCheck';

describe('verifyLicenseCheck', () => {
  it('verify: Verifies the license-check signatures correctly', async () => {
    const testPublicKeyPem = `-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAES7jvFxC50Fe2hHd3Sn7Q8TvnxuSZ\nV8HvRHGDvFacOiESAqg3uroeNTgoT7lD4BwQ+fFsn7zig5hwncoTsrCPbw==\n-----END PUBLIC KEY-----`;
    const testLicenseCheckData = [
      { capability: 'One', expiry: '2024-08-14T13:15:49.310Z' },
      { capability: 'Two', expiry: '2024-08-14T13:15:49.310Z' },
      { capability: 'free_plan_name', expiry: '2024-08-14T13:32:29.313Z' },
      { capability: 'Three', expiry: '2024-08-14T13:32:29.313Z' },
      { capability: 'Four', expiry: '2024-08-14T13:32:29.313Z' },
    ];
    const testSignature = '3045022100b210aa29519f3146afe7a0d343a6b7ec5e47a1ac0de9686e2ec4cf0081e159c402206ecf98ad4d1d339c59f7ff3b4744d1f377747702c6253f7904ef6589191a2254';
    const testIncorrectSignature = 'bad-signature';

    const falseLicenseCheck = verifyLicenseCheck({
      publicKey: testPublicKeyPem,
      signature: testIncorrectSignature,
      payload: JSON.stringify(testLicenseCheckData),
    });
    const trueLicenseCheck = verifyLicenseCheck({
      publicKey: testPublicKeyPem,
      signature: testSignature,
      payload: JSON.stringify(testLicenseCheckData),
    });

    expect(falseLicenseCheck).toEqual(false);
    expect(trueLicenseCheck).toEqual(true);
  });
})
