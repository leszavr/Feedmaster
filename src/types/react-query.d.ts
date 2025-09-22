// Temporary fix for @tanstack/react-query TypeScript issues
declare module '@tanstack/react-query' {
  export * from '@tanstack/react-query/build/legacy/index';
}