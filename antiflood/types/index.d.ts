// @disckit/antiflood — TypeScript definitions

export declare const FLOOD_RESULT: Readonly<{
  ALLOWED: "ALLOWED"; THROTTLED: "THROTTLED"; PENALIZED: "PENALIZED"; WHITELISTED: "WHITELISTED";
}>;

export declare const PENALTY_MODE: Readonly<{
  NONE: "NONE"; ADDITIVE: "ADDITIVE"; EXPONENTIAL: "EXPONENTIAL";
}>;

export interface RuleConfig {
  windowMs?: number; maxHits?: number;
  penaltyMode?: "NONE" | "ADDITIVE" | "EXPONENTIAL";
  penaltyStep?: number; maxPenalty?: number;
}

export interface CheckResult {
  result: "ALLOWED" | "THROTTLED" | "PENALIZED" | "WHITELISTED";
  retryAfterMs: number; hitsInWindow: number; penaltyUntil: number; rule: Required<RuleConfig>;
}

export interface CheckParams {
  userId: string; guildId?: string; commandName?: string; memberRoleIds?: string[];
}

export declare class AntifloodManager {
  constructor(options?: { globalRule?: RuleConfig; whitelistRoleIds?: string[]; enabled?: boolean });
  setRule(commandName: string, ruleConfig: RuleConfig): this;
  hasRule(commandName: string): boolean;
  addWhitelist(...roleIds: string[]): this;
  removeWhitelist(roleId: string): this;
  disable(): this; enable(): this;
  check(params: CheckParams): CheckResult;
  reset(params: { userId: string; guildId?: string; commandName?: string }): void;
  resetAll(): void;
  readonly activeBuckets: number;
}

export declare function createRule(config?: RuleConfig): Required<RuleConfig>;
export declare function formatRetryAfter(ms: number): string;
export declare function isBlocked(checkResult: CheckResult): boolean;
