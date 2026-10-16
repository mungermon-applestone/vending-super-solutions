import type { Plugin } from 'vite'
export function agentPagesPlugin(): Plugin
export function generateAgentFiles(outDir: string): Promise<void>
