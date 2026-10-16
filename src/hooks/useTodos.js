import { useEffect, useState } from 'react';

const STORAGE_KEY = 'todos';

// Membaca data dari localStorage saat aplikasi pertama dibuka
function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    // Isi nilai bawaan untuk field yang belum ada di data lama
    return parsed.map((todo) => ({ startAt: '', dueAt: '', ...todo }));
  } catch {
    return [];
  }
}

export function useTodos() {
  const [todos, setTodos] = useState(loadTodos);

  // Setiap kali todos berubah, simpan ke localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  // CREATE
function addTodo({ title, note = '', startAt = '', dueAt = '' }) {
  const now = new Date().toISOString();
  const newTodo = {
    id: crypto.randomUUID(),
    title: title.trim(),
    status: 'none',
    note: note.trim(),
    startAt,
    dueAt,
    createdAt: now,
    updatedAt: now,
  };
  setTodos((prev) => [newTodo, ...prev]);
}

  // UPDATE
  function updateTodo(id, changes) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, ...changes, updatedAt: new Date().toISOString() }
          : todo
      )
    );
  }

  // DELETE
  function deleteTodo(id) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  return { todos, addTodo, updateTodo, deleteTodo };
}