import { KitchenDisplay } from './screens/KitchenDisplay';
import { DemoPanel } from './demo/DemoPanel';

/**
 * Main App Component
 */
function App() {
  const isDevelopment = import.meta.env.DEV;

  return (
    <>
      <KitchenDisplay />
      {isDevelopment && <DemoPanel />}
    </>
  );
}

export default App;
