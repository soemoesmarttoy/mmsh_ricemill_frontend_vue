/// <reference types="vite/client" />
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // Using Record<string, unknown> satisfies the linter
  // while properly defining the component's structure
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}
