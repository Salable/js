import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import 'vitest-fetch-mock'
import { verifyLicenseCheck } from '../verifyLicenseCheck';

beforeEach(() => {
  const mockWindow = {
    crypto: {
      subtle: {
        verify: vi.fn().mockResolvedValueOnce(true),
        importKey: vi.fn().mockResolvedValueOnce('test-public-key')
      }
    },
    atob: vi.fn().mockReturnValue('test')
  };

  global.window = mockWindow as any;
});

afterEach(() => {
  delete global.window;
});

describe('verifyLicenseCheck', () => {
  const testPublicKeyPem = "-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEpvPnWBU16MJHit3P+w4LpX1voYKM\n+ujc42/kGb+6GC/BMvK8FQwc4pBnkg+0ZdCyKtNgP5l1pHV8yRgfn+DLRQ==\n-----END PUBLIC KEY-----\n";
  const testPayload = "Eiusmod aute velit esse labore ullamco ad dolore velit id ullamco. Proident enim sint duis tempor ut in ea enim occaecat sunt. Ex exercitation aliquip veniam nulla cillum ut est nostrud velit. Anim qui id cillum est mollit laboris ex occaecat Lorem irure eu enim anim. Ad ullamco qui consequat esse nulla dolor voluptate irure laborum. Magna pariatur cupidatat velit duis aliqua aute minim laboris id tempor dolor magna amet ipsum. Lorem ullamco ad eiusmod veniam ut laboris occaecat magna enim aliquip. Velit qui aute eu duis eu in labore laborum qui non minim. Nulla est tempor cupidatat ex aliqua laboris id veniam eu. Laborum sint ipsum est ipsum in nostrud occaecat eiusmod reprehenderit qui tempor magna ea deserunt nulla. Nostrud enim cupidatat tempor qui est veniam excepteur laborum exercitation tempor officia minim culpa occaecat Lorem Lorem sunt quis dolor. Nulla cupidatat aliquip culpa deserunt nisi deserunt minim exercitation excepteur eiusmod quis. Amet ex eiusmod reprehenderit non do magna consequat incididunt laborum est labore fugiat occaecat anim deserunt consectetur. Cupidatat exercitation esse esse do deserunt proident cupidatat consectetur ea reprehenderit velit id excepteur aliqua aliqua labore magna non dolore. Exercitation ea nostrud dolore laboris pariatur tempor sit consequat occaecat tempor culpa ipsum et officia voluptate. Exercitation do minim quis adipisicing dolore eiusmod consequat tempor ullamco dolore eu fugiat incididunt excepteur. Duis culpa consectetur ipsum dolore laboris irure qui culpa cillum voluptate ea ad. Laborum anim voluptate velit dolor cupidatat et nulla laborum non ea labore aliqua in consectetur laborum esse aliquip. Minim commodo magna aliquip sit ea deserunt velit qui dolor. Officia id velit incididunt eiusmod reprehenderit deserunt elit cupidatat nulla occaecat mollit ut eiusmod enim voluptate ad ipsum Lorem. Ea irure nulla occaecat deserunt commodo consequat nisi esse ex ad laborum sit elit nulla ut nulla in aliqua commodo. Sit do adipisicing occaecat aliqua incididunt fugiat dolor cupidatat labore nisi proident enim nostrud ipsum reprehenderit. Amet voluptate ea et qui deserunt elit cillum anim magna Lorem dolore adipisicing amet. Mollit ex cillum in excepteur in laboris anim adipisicing occaecat esse laboris."
  const testSignature = 'ac8f4105a786f6a5af98eae4c959dc8781e19ebac6c238f7a4f5ec451af1e93fc6330481f0d6d4a099258731cc4d887e390dd4c41f116df42444206bc7884b76';

  it('verify: Verifies the license-check signatures correctly', async () => {
    const check = await verifyLicenseCheck({ publicKey: testPublicKeyPem, signature: testSignature, payload: testPayload });

    expect(window.crypto.subtle.importKey).toHaveBeenCalledWith(
      'spki',
      expect.any(ArrayBuffer),
      {
        name: "ECDSA",
        namedCurve: "P-256",
      },
      true,
      ["verify"]
    );

    expect(window.crypto.subtle.verify).toHaveBeenCalledWith(
      {
        name: 'ECDSA',
        hash: { name: 'SHA-256' }
      },
      expect.anything(),
      expect.any(ArrayBuffer),
      expect.any(Uint8Array),
    );
    expect(check).toBe(true)
  });
});