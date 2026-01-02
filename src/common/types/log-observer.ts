import { type LogEntry } from '../interfaces/log-entry.js';

export type LogObserver = (entry: LogEntry) => void | Promise<void>;
