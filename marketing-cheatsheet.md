# PassiveIntent Marketing Cheat Sheet

## Calibration Mandate

Important note on propensity thresholds: the Propensity to Convert values are not universal constants. A 3-page checkout funnel and a 40-page discovery catalog have entirely different structural probabilities.

The thresholds below assume a calibrated baseline. The engine starts from raw
Markov probabilities, and how quickly it accumulates organic learning depends on
your privacy and storage mode.

In zero-consent, ephemeral deployments, the model resets with the tab. In that
setup, Blueprint JSON is the practical path to instant, high-sensitivity
funnel enforcement.

Teams that want cross-session organic baseline learning can either enable
persistent storage under their own ePrivacy and cookie compliance policy or
move to Enterprise Persistent Graph Consolidator.

Practical adoption note: most teams will start with the browser quickstart
because it works immediately. If they choose browser persistence, they also own
the responsibility to gate that deployment behind the right consent and storage
policy for their environment.

## Positioning Blueprints and Enterprise Memory

Business framing to prefer: the open-source path gives teams a synthetic
starting point plus live-session memory. The enterprise path is for teams that
want the engine to retain and compound organic learning about their own
customers over a longer horizon instead of resetting back to a generic prior.

Commercial phrasing to prefer: "If your sessions are short and you need
instant, high-sensitivity funnel enforcement, start with a Blueprint. If you want the model to retain
customer-specific learning across sessions, you either need compliant persistent
storage or Enterprise Persistent Graph Consolidator."

## Behavioral Topography Matrix

| State / Intensity | Psychological Profile                             | SDK Event Fired       | Engine Math & Developer Check                                             | Propensity  | The Business Action (UI Intervention)                                                                    |
| ----------------- | ------------------------------------------------- | --------------------- | ------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------- |
| Low               | The Conviction Buyer. Decisive, linear path.      | `(None)`              | Trajectory Z-Score: < 1.5. No anomalies detected.                         | > 0.85      | Protect Margin. Suppress all popups and discount codes. Let them buy.                                    |
| Mild              | The Window Shopper. Browsing, exploring options.  | `high_entropy`        | Normalized Entropy: > 0.75. Check `payload.normalizedEntropy`.            | 0.40 - 0.84 | Nudge. Do not discount yet. Show social proof such as "15 people bought this today."                     |
| High              | Cognitive Friction. Stuck reading fine print.     | `dwell_time_anomaly`  | Dwell Z-Score: > 2.5. Check `payload.zScore > 0` so it is slow, not fast. | 0.15 - 0.39 | Incentivize. Trigger the margin-saving intervention. Fire a "Free Shipping" popup.                       |
| Critical          | Anxiety / Frustration. Looping, lost, or erratic. | `trajectory_anomaly`  | Trajectory Z-Score: > 3.5. Check `payload.confidence`.                    | < 0.15      | Rescue. Trigger an immediate customer support modal or live chat.                                        |
| Compound          | Confirmed Hesitation. Frozen and confused.        | `hesitation_detected` | Correlation: trajectory and dwell triggered within 30s of each other.     | < 0.39      | The Kill Shot. Highest-confidence intervention. Fire your absolute best discount offer.                  |
| Leaving           | Exit Intent. Mouse moving to close tab.           | `exit_intent`         | Kinematics + math: mouseleave toward chrome plus `likelyNext >= 0.4`.     | Any         | Last Chance. Trigger a targeted retention overlay using `payload.likelyNext` to personalize the message. |
| Ghost             | Attention Return. Tab hidden, then refocused.     | `attention_return`    | Time away: >= 15s. Check `payload.hiddenDuration`.                        | Any         | Re-engage. "Welcome back! Still thinking about [Last Product]?"                                          |
| Idle              | Mentally Gone. Tab open, user AFK.                | `user_idle`           | Inactivity: > 120s. Check `payload.idleMs`.                               | Any         | Reactivate. Pulse the tab title or trigger a soft visual nudge to draw the eye back.                     |
| Back              | Resumed. User moves mouse after idle.             | `user_resumed`        | Return from idle: event fires with total `payload.idleMs`.                | Any         | Welcome Back. Resume UI state where they left off.                                                       |
