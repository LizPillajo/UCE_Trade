import { AppRouter } from './routes/AppRouter';
import { useMqttNotifications } from './hooks/useMqttNotifications';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  
  console.log("📢📢📢 EJECUTANDO APP.JSX 📢📢📢");
  
  useMqttNotifications();
  
  return (
    <div className="App">
      <AppRouter />
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}

export default App;