import React, { useState, useRef, useEffect } from 'react'
import { Task, TaskStatus } from '../types/types'
import { useDispatch } from 'react-redux'
import { editTask, deleteTask } from '../features/taskSlice'
import { AppDispatch } from '../app/store'
import { FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa'
import { Modal } from 'antd'
import { toast } from 'react-toastify'

interface Props {
  task: Task
}

const statusColorMap: Record<TaskStatus, { bg: string; text: string }> = {
  pending: { bg: 'bg-yellow-200', text: 'text-yellow-800' },
  'in-progress': { bg: 'bg-blue-200', text: 'text-blue-800' },
  completed: { bg: 'bg-green-200', text: 'text-green-800' },
}

const TaskItem: React.FC<Props> = ({ task }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleSave = () => {
    if (editedTitle.trim() === '') {
      toast.error('Task title cannot be empty.')
      return
    }
    if (editedTitle !== task.title) {
      dispatch(editTask({ ...task, title: editedTitle }))
      toast.success('Task is edited successfully.')
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedTitle(task.title)
    setIsEditing(false)
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as TaskStatus
    if (newStatus !== task.status) {
      dispatch(editTask({ ...task, status: newStatus }))
      toast.info(`Task status changed to ${newStatus.replace('-', ' ')}`)
    }
  }

  const handleDelete = () => {
    Modal.confirm({
      title: 'Delete Task',
      content: 'Are you sure you want to delete this task?',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        dispatch(deleteTask(task.id))
        toast.warn('Task deleted successfully.')
      },
    })
  }

  const { bg, text } = statusColorMap[task.status]

  return (
    <div className="w-full  mx-auto mb-6">
      <div className="bg-gray-50 shadow-md rounded-lg border border-gray-300 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col justify-between h-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="flex-1 border-b-2 border-blue-500 focus:outline-none text-lg font-semibold truncate transition-colors duration-200 mb-2 sm:mb-0 bg-transparent"
              placeholder="Task Title"
              aria-label="Edit Task Title"
            />
          ) : (
            <h3 className="text-lg font-semibold truncate">{task.title}</h3>
          )}
          <span className={`ml-0 sm:ml-4 px-3 py-1 text-xs font-medium uppercase rounded-full ${bg} ${text}`}>
            {task.status.replace('-', ' ').toUpperCase()}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center mt-auto space-y-3 sm:space-y-0 sm:space-x-4 w-full">
          <select
            value={task.status}
            onChange={handleStatusChange}
            className="border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 transition-colors duration-200 w-full sm:w-auto"
            disabled={isEditing}
            aria-label="Change Task Status"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In-Progress</option>
            <option value="completed">Completed</option>
          </select>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center justify-center bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200 w-full sm:w-auto"
                  title="Save"
                  aria-label="Save Task"
                >
                  <FaSave className="mr-2" /> Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center justify-center bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors duration-200 w-full sm:w-auto"
                  title="Cancel"
                  aria-label="Cancel Editing"
                >
                  <FaTimes className="mr-2" /> Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 w-full sm:w-auto"
                  title="Edit"
                  aria-label="Edit Task"
                >
                  <FaEdit className="mr-2" /> Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center justify-center bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-200 w-full sm:w-auto"
                  title="Delete"
                  aria-label="Delete Task"
                >
                  <FaTrash className="mr-2" /> Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskItem
