import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <DataProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DataProvider>
  </AuthProvider>

);

