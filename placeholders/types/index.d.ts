// Supports both CJS and ESM:
//   const { X } = require("@disckit/placeholders");   // CommonJS
//   import { X } from "@disckit/placeholders";         // ESM (Node >=18, bundlers)
//
// @disckit/placeholders — TypeScript definitions

export interface GuildContext { name?: string; id?: string; memberCount?: number; icon?: string; }
export interface MemberContext { id?: string; name?: string; nick?: string; dis?: string; tag?: string; mention?: string; avatar?: string; }
export interface InviterContext { name?: string; tag?: string; effectiveInvites?: number; }
export interface ExtrasContext { level?: number | string; xp?: number | string; rank?: number | string; coins?: number | string; }
export interface RoleResolverContext { resolve(roleId: string): string | null; }

export interface PlaceholderContext {
  guild?: GuildContext;
  member?: MemberContext;
  inviter?: InviterContext;
  extras?: ExtrasContext;
  roles?: RoleResolverContext;
}

export interface PresenceContext { servers: number; members: number; }

export interface VariableDefinition {
  key: string;
  group: "guild" | "member" | "inviter" | "extras" | "role" | "presence";
  description: string;
  example: string;
}

/** Apply all placeholders to a string using the given context. */
export declare function applyPlaceholders(content: string, context: PlaceholderContext): string;

/** Detect all placeholder tokens used in a string. */
export declare function detectPlaceholders(content: string): string[];

/** Returns true if the string contains any placeholder tokens. */
export declare function hasPlaceholders(content: string): boolean;

/** Build a preview PlaceholderContext from flat data — useful for dashboard previews. */
export declare function buildPreviewContext(flat?: Record<string, unknown>): PlaceholderContext;

/** Apply {servers} and {members} to a bot status string. */
export declare function applyPresencePlaceholders(
  message: string,
  context: PresenceContext | { resolver: () => Promise<PresenceContext> }
): Promise<string>;

/** Build a simple PresenceContext from raw counts. */
export declare function buildPresenceContext(servers: number, members: number): PresenceContext;

export declare const VARIABLES: VariableDefinition[];
export declare function getByGroup(group: string): VariableDefinition[];
export declare function getAllKeys(): string[];
export declare function findByKey(key: string): VariableDefinition | undefined;
