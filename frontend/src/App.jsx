import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';

function App() {
  return (
    <BrowserRouter>
      {/* Toàn bộ router tập trung tại src/routes */}
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
