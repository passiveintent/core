/**
 * Copyright (c) 2026 Purushottam <purushottam@passiveintent.dev>
 *
 * This source code is licensed under the AGPL-3.0-only license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { normalizeRouteState } from './route-normalizer.js';
import type { PassiveIntentError } from '../types/events.js';

type ValidationError = Pick<PassiveIntentError, 'code' | 'message'> & { code: 'VALIDATION' };

export function resolveTrackedState(
  raw: string,
  owner: 'IntentEngine' | 'IntentManager',
  stateNormalizer: ((state: string) => string) | undefined,
  onError?: (error: ValidationError) => void,
): string | null {
  let state = normalizeRouteState(raw);

  if (stateNormalizer) {
    try {
      const normalized = stateNormalizer(state);
      if (typeof normalized !== 'string') {
        onError?.({
          code: 'VALIDATION',
          message: `${owner}.track(): stateNormalizer must return a string, got ${typeof normalized}`,
        });
        return null;
      }
      if (normalized === '') return null;
      state = normalized;
    } catch (err) {
      onError?.({
        code: 'VALIDATION',
        message: `${owner}.track(): stateNormalizer threw: ${
          err instanceof Error ? err.message : String(err)
        }`,
      });
      return null;
    }
  }

  if (state === '') {
    onError?.({
      code: 'VALIDATION',
      message: `${owner}.track(): state label must not be an empty string`,
    });
    return null;
  }

  return state;
}
