import { describe, expect, it, vi } from 'vitest';
import { resolveAffiliateUrl } from '@/lib/resolve-affiliate';
const valid = 'https://www.amazon.com.br/dp/B0FPGF9J2J?tag=valneymaia05-20';
describe('resolução segura sem navegação ao destino', () => {
  it('resolve dois saltos oficiais e para antes da Amazon', async () => {
    const request = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(null, { status: 302, headers: { location: 'https://amzlinks.in/B0929exza' } }),
      )
      .mockResolvedValueOnce(new Response(null, { status: 302, headers: { location: valid } }));
    expect(await resolveAffiliateUrl('https://link.amazon/B0929exza', request)).toBe(valid);
    expect(request).toHaveBeenCalledTimes(2);
  });
  it.each([
    'http://127.0.0.1/test',
    'https://evil.com/abcde',
    'https://link.amazon.evil.com/abcde',
    'https://link.amazon/abcde?url=http://127.0.0.1',
    'https://link.amazon@127.0.0.1/abcde',
  ])('rejeita SSRF %s', async (value) => {
    const request = vi.fn();
    await expect(resolveAffiliateUrl(value, request)).rejects.toThrow();
    expect(request).not.toHaveBeenCalled();
  });
  it('rejeita salto fora da allowlist sem acessá-lo', async () => {
    const request = vi
      .fn()
      .mockResolvedValue(
        new Response(null, { status: 302, headers: { location: 'https://127.0.0.1/abcde' } }),
      );
    await expect(resolveAffiliateUrl('https://link.amazon/B0929exza', request)).rejects.toThrow();
    expect(request).toHaveBeenCalledTimes(1);
  });
  it('limita loops', async () => {
    const request = vi
      .fn()
      .mockImplementation(
        async () =>
          new Response(null, {
            status: 302,
            headers: { location: 'https://link.amazon/B0929exza' },
          }),
      );
    await expect(resolveAffiliateUrl('https://link.amazon/B0929exza', request)).rejects.toThrow(
      'limite',
    );
    expect(request).toHaveBeenCalledTimes(5);
  });
});
