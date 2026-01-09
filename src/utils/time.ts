import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';

dayjs.extend(relativeTime);
dayjs.extend(duration);

/**
 * Get elapsed time in seconds
 */
export function getElapsedSeconds(timestamp: number): number {
  return Math.floor((Date.now() - timestamp) / 1000);
}

/**
 * Format elapsed time as MM:SS
 */
export function formatElapsedTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format timestamp as human-readable time
 */
export function formatTime(timestamp: number): string {
  return dayjs(timestamp).format('h:mm A');
}

/**
 * Check if order is late
 * Late threshold: 5 minutes for PAID, 10 minutes for IN_PROGRESS
 */
export function isOrderLate(
  createdAt: number,
  status: string,
  startedAt?: number
): boolean {
  const elapsedSinceCreated = getElapsedSeconds(createdAt);

  if (status === 'PAID') {
    // Order should start within 5 minutes
    return elapsedSinceCreated > 300; // 5 minutes
  }

  if (status === 'IN_PROGRESS' && startedAt) {
    // Order should complete within 10 minutes of starting
    const preparationTime = getElapsedSeconds(startedAt);
    return preparationTime > 600; // 10 minutes
  }

  return false;
}
