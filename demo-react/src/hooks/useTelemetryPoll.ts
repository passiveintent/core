/**
 * useTelemetryPoll — polls getTelemetry() on a fixed interval and returns the
 * current snapshot. Replaces the repeated useEffect + useState + setInterval
 * pattern in Overview and IntentMeter.
 *
 * @param intervalMs - polling interval in milliseconds (default: 1000)
 */
import { useEffect, useState } from 'react';
import { usePassiveIntent } from '@passiveintent/react';
import type { PassiveIntentTelemetry } from '@passiveintent/react';

export function useTelemetryPoll(intervalMs = 1000): PassiveIntentTelemetry | null {
  const { getTelemetry } = usePassiveIntent();
  const [telem, setTelem] = useState<PassiveIntentTelemetry | null>(null);

  useEffect(() => {
    setTelem(getTelemetry());
    const id = setInterval(() => setTelem(getTelemetry()), intervalMs);
    return () => clearInterval(id);
  }, [getTelemetry, intervalMs]);

  return telem;
}
