import React from 'react';
import { useForm } from 'react-hook-form';
import { TaskStatus } from '../types/types';
import { useDispatch } from 'react-redux';
import { addTask } from '../features/taskSlice';
import { AppDispatch } from '../app/store';
import { toast } from 'react-toastify';

interface FormInputs {
  title: string;
  status: TaskStatus;
}

const AddTaskForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>();
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = (data: FormInputs) => {
    dispatch(addTask(data));
    toast.success('Task added successfully.');
    reset();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = (errors: any) => {
    if (errors.title) {
      toast.error('Task title cannot be empty.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 mb-6"
    >
      <div className="flex-1 w-full">
        <input
          {...register('title', { required: 'Task title is required' })}
          placeholder="Task Title"
          className={`w-full border p-2 rounded ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          aria-label="Task Title"
        />
      </div>
      <div className="w-full md:w-auto">
        <select
          {...register('status')}
          className="border p-2 rounded bg-white text-gray-800"
          defaultValue="pending"
          aria-label="Task Status"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In-Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <button
        type="submit"
        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded w-full md:w-auto"
        aria-label="Add Task"
      >
        Add Task
      </button>
    </form>
  );
};

export default AddTaskForm;
