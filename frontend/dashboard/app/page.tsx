"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import ThemeToggle from "./ThemeToggle";
import { Task, Comment } from "../../shared/types/types";

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newComment, setNewComment] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/tasks")
      .then((res) => setTasks(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/comments")
      .then((res) => setComments(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    axios
      .post(
        "https://us-west-2.cdn.hygraph.com/content/cmfkzdb80022d07vu2lo5g2mk/master",
        {
          query: `
        {
          announcements {
            title
          }
        }
      `,
        }
      )
      .then((res) => {
        if (res.data.data.announcements.length > 0) {
          setAnnouncement(res.data.data.announcements[0].title);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleAddTask = async () => {
    if (!newTask) return;
    const res = await axios.post("http://localhost:3001/api/tasks", {
      title: newTask,
    });
    setTasks([...tasks, res.data]);
    setNewTask("");
  };

  const handleDeleteTask = async (id: number) => {
    await axios.delete(`http://localhost:3001/api/tasks/${id}`);
    setTasks(tasks.filter((task) => task.id !== id));
    setComments(comments.filter((comment) => comment.task_id !== id));
  };

  const handleAddComment = async () => {
    if (!newComment) return;
    const res = await axios.post("http://localhost:3001/api/comments", {
      content: newComment,
      task_id: selectedTaskId,
    });
    setComments([...comments, res.data]);
    setNewComment("");
    setSelectedTaskId(null);
  };

  const handleDeleteComment = async (id: number) => {
    await axios.delete(`http://localhost:3001/api/comments/${id}`);
    setComments(comments.filter((comment) => comment.id !== id));
  };


  const getCommentsForTask = (taskId: number) => {
    return comments.filter((comment) => comment.task_id === taskId);
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-4">Team Task Manager</h1>
        <ThemeToggle />
      </div>

      <div className="mb-6 p-4 rounded bg-blue-50 text-blue-900 dark:bg-blue-900 dark:text-blue-100">
        <h2 className="text-xl font-semibold">Announcement</h2>
        <p>{announcement || "Loading announcement..."}</p>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Tasks</h2>
      <div className="mb-6">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="mb-4 p-4 rounded bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 shadow-sm"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg">{task.title}</span>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                onClick={() => handleDeleteTask(task.id)}
              >
                Delete Task
              </button>
            </div>

            <div className="ml-4">
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                Comments:
              </h4>
              {getCommentsForTask(task.id).map((comment) => (
                <div
                  key={comment.id}
                  className="flex justify-between items-center mb-1 p-2 rounded bg-gray-100 text-gray-900 dark:bg-gray-600 dark:text-gray-100"
                >
                  <span className="text-sm">{comment.content}</span>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}

              <div className="flex gap-2 mt-2">
                <input
                  className="border px-2 py-1 rounded text-black dark:text-white dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Add comment..."
                  value={selectedTaskId === task.id ? newComment : ""}
                  onChange={(e) => {
                    setNewComment(e.target.value);
                    setSelectedTaskId(task.id);
                  }}
                />
                <button
                  onClick={handleAddComment}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  disabled={selectedTaskId !== task.id || !newComment}
                >
                  Add Comment
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="border px-2 py-1 rounded text-black dark:text-white dark:bg-gray-700 dark:border-gray-600"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New Task"
        />
        <button
          onClick={handleAddTask}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          Add Task
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">All Comments</h2>
        <div className="space-y-2">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex justify-between items-center p-3 rounded bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 shadow-sm"
            >
              <div>
                <span className="text-sm">{comment.content}</span>
                {comment.task_id && (
                  <span className="text-xs text-gray-500 dark:text-gray-300 ml-2">
                    (Task #{comment.task_id})
                  </span>
                )}
              </div>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                onClick={() => handleDeleteComment(comment.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}