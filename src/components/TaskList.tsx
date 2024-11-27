import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { TaskStatus } from '../types/types';
import { RootState } from '../app/store';
import TaskItem from './TaskItem';

const TaskList: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'columns'>('columns'); 

  const filteredTasks = tasks.filter((task) =>
    filter === 'all' ? true : task.status === filter
  );

  const filterButtons: { label: string; value: TaskStatus | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'In-Progress', value: 'in-progress' },
    { label: 'Completed', value: 'completed' },
  ];

  const pendingTasks = tasks.filter((task) => task.status === 'pending');
  const inProgressTasks = tasks.filter((task) => task.status === 'in-progress');
  const completedTasks = tasks.filter((task) => task.status === 'completed');

  return (
    <div className="p-4">
      <div className="flex justify-end mb-4">
        {viewMode === 'columns' ? (
          <button
            onClick={() => setViewMode('list')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            Show All
          </button>
        ) : (
          <button
            onClick={() => setViewMode('columns')}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
          >
            Column View
          </button>
        )}
      </div>

      {viewMode === 'columns' ? (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-4">Pending</h2>
            <div className="space-y-4 h-[60vh] overflow-auto">
              {pendingTasks.length > 0 ? (
                pendingTasks.map((task) => <TaskItem key={task.id} task={task} />)
              ) : (
                <p className="text-gray-500">No pending tasks.</p>
              )}
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-center">
            <div className="border-l-2 border-dotted border-gray-300 h-full"></div>
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-4">In-Progress</h2>
            <div className="space-y-4 h-[60vh] overflow-auto">
              {inProgressTasks.length > 0 ? (
                inProgressTasks.map((task) => <TaskItem key={task.id} task={task} />)
              ) : (
                <p className="text-gray-500">No in-progress tasks.</p>
              )}
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-center">
            <div className="border-l-2 border-dotted border-gray-300 h-full"></div>
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-4">Completed</h2>
            <div className="space-y-4 h-[60vh] overflow-auto">
              {completedTasks.length > 0 ? (
                completedTasks.map((task) => <TaskItem key={task.id} task={task} />)
              ) : (
                <p className="text-gray-500">No completed tasks.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-6">
            {filterButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => setFilter(btn.value)}
                className={`px-4 py-2 rounded ${
                  filter === btn.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } transition-colors duration-200`}
              >
                {btn.label}
              </button>
            ))}
          </div>
          {filteredTasks.length > 0 ? (
            <div className="space-y-4 h-[60vh] overflow-auto">
              {filteredTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 h-[60vh] overflow-auto">No tasks available.</p>
          )}
        </>
      )}
    </div>
  );
};

export default TaskList;
