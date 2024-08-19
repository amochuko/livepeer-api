// (global as any).fetch = jest.fn(url => Promise.resolve(mockResponse(url)));

// function mockResponse(url: string): unknown {
//   switch (url) {
//     case 'https://example.com/api/data':
//       return { ok: 200, json: () => Promise.resolve({ key: 'value' }) };
//     case 'https://example.com/api/error':
//       throw new Error('Simulated network error');
//     default:
//       return {
//         ok: 200,
//         json: () => Promise.resolve('Default response'),
//       };
//   }
// }

/**
 * This file is use to set up mock for modules
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).fetch = jest.fn(() =>
  Promise.resolve({ ok: 200, json: () => Promise.resolve({ key: 'value' }) }),
);