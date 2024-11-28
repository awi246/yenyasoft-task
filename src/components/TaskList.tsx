import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TaskStatus } from '../types/types';
import { RootState } from '../app/store';
import TaskItem from './TaskItem';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { editTask } from '../features/taskSlice';
import { AppDispatch } from '../app/store';

const TaskList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'columns'>('columns');

  const filterButtons: { label: string; value: TaskStatus | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'In-Progress', value: 'in-progress' },
    { label: 'Completed', value: 'completed' },
  ];

  const getTasksByStatus = (status: TaskStatus) =>
    tasks.filter((task) => task.status === status);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const task = tasks.find((t) => t.id.toString() === draggableId);
    if (!task) return;

    const newStatus = destination.droppableId as TaskStatus;

    if (task.status !== newStatus) {
      dispatch(editTask({ ...task, status: newStatus }));
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-col items-center mb-4">
        {viewMode === 'columns' ? (
          <>
            <span className="font-bold mb-2">
              You can drag and drop to change the status
            </span>
            {/* <button
              onClick={() => setViewMode('list')}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
            >
              Show All
            </button> */}
          </>
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
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex flex-col sm:flex-row gap-4 overflow-x-auto">
            {(['pending', 'in-progress', 'completed'] as TaskStatus[]).map(
              (status) => (
                <Droppable key={status} droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      className={`flex-1 bg-gray-100 rounded-md p-4 ${
                        snapshot.isDraggingOver ? 'bg-gray-200' : ''
                      }`}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <h2 className="text-xl font-semibold mb-4 capitalize">
                        {status.replace('-', ' ')}
                      </h2>
                      <div className="space-y-4 min-h-[60vh]">
                        {getTasksByStatus(status).map((task, index) => (
                          <Draggable
                            key={task.id.toString()}
                            draggableId={task.id.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`${
                                  snapshot.isDragging
                                    ? 'bg-blue-100'
                                    : 'bg-white'
                                } rounded-md shadow-sm`}
                              >
                                <TaskItem task={task} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              )
            )}
          </div>
        </DragDropContext>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
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
          {filter === 'all'
            ? tasks.length > 0
              ? (
                <div className="space-y-4 h-[60vh] overflow-auto">
                  {tasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </div>
              )
              : <p className="text-gray-500 h-[60vh] overflow-auto">No tasks available.</p>
            : (
              <>
                {getTasksByStatus(filter).length > 0 ? (
                  <div className="space-y-4 h-[60vh] overflow-auto">
                    {getTasksByStatus(filter).map((task) => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 h-[60vh] overflow-auto">
                    No {filter.replace('-', ' ')} tasks.
                  </p>
                )}
              </>
            )}
        </>
      )}
    </div>
  );
};

export default TaskList;
