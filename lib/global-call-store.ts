// lib/global-call-store.ts
// 全局通话悬浮窗状态管理器：支持跨聊天室、跨 App、桌面悬浮
import type { ChatSession } from "./chat-storage";
import type { Character } from "./character-types";

export interface GlobalCallState {
    type: "voice" | "video";
    session: ChatSession;
    character: Character;
    initiator: "user" | "character";
    minimized: boolean;
}

type CallListener = (state: GlobalCallState | null) => void;

let currentCallState: GlobalCallState | null = null;
const listeners = new Set<CallListener>();

export function getGlobalCallState(): GlobalCallState | null {
    return currentCallState;
}

export function setGlobalCallState(nextState: GlobalCallState | null): void {
    currentCallState = nextState;
    listeners.forEach((fn) => {
        try {
            fn(currentCallState);
        } catch (e) {
            console.warn("[GlobalCall] listener error:", e);
        }
    });
}

export function subscribeGlobalCallState(fn: CallListener): () => void {
    listeners.add(fn);
    return () => {
        listeners.delete(fn);
    };
}
