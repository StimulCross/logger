import { type LogEntry } from '../interfaces/log-entry.js';

/** @internal */
export type LogObserver = (entry: LogEntry) => void | Promise<void>;
