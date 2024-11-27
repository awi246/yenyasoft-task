import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { TaskStatus } from '../types/types';
import { RootState } from '../app/store';
import TaskItem from './TaskItem';

const TaskList: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');

  const filteredTasks = tasks.filter((task) =>
    filter === 'all' ? true : task.status === filter
  );

  const filterButtons: { label: string; value: TaskStatus | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'In-Progress', value: 'in-progress' },
    { label: 'Completed', value: 'completed' },
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6 ">
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
    </div>
  );
};

export default TaskList;
