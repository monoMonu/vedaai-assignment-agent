import { ConnectionOptions, Queue } from 'bullmq';
import Redis from 'ioredis';
import { REDIS_URL } from '../config';

export const redisConnection = new Redis(REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

export const assignmentQueue = new Queue('assignmentQueue', {
  connection: redisConnection as ConnectionOptions,
});