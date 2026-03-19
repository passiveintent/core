import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css';

// React.StrictMode intentionally omitted: StrictMode's double-invoke of effects
// causes children (LogContext, IntentMeter) to re-subscribe before the parent
// PassiveIntentProvider's useEffect can recreate the instance, resulting in all
// subscriptions silently becoming NOOP_UNSUBSCRIBE. This is a known limitation
// of the child-before-parent effect ordering in React 18's Strict Mode cycle.
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
