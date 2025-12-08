import '@testing-library/jest-dom';

jest.mock('better-auth/react', () => ({
  createAuthClient: jest.fn(() => ({
    token: jest.fn(() => ({ data: { token: 'mock-jwt-token' } })),
    signOut: jest.fn(),
  })),
}));

jest.mock('better-auth/client/plugins', () => ({
  jwtClient: jest.fn(() => ({
    getClaims: jest.fn(() => ({ userId: 'mock-user-id' })),
  })),
}));