import React from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import AddTaskForm from './components/AddTaskForm';
import TaskList from './components/TaskList';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl bg-white rounded shadow p-6">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Task Manager
          </h1>
          <AddTaskForm />
          <TaskList />
        </div>
      </div>
      <ToastContainer
        position="top-right"
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Provider>
  );
};

export default App;
