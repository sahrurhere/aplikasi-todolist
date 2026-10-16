import { STATUSES } from '../constants/status';

// Urutan saat diurutkan berdasarkan status:
// yang sedang dikerjakan di atas, yang selesai di bawah.
const STATUS_ORDER = { progress: 0, pending: 1, none: 2, done: 3 };

export function countByStatus(todos) {
  const counts = { all: todos.length };
  for (const status of STATUSES) {
    counts[status.value] = 0;
  }
  for (const todo of todos) {
    if (todo.status in counts) {
      counts[todo.status] += 1;
    }
  }
  return counts;
}

export function getVisibleTodos(todos, { filter, query, sortBy }) {
  const keyword = query.trim().toLowerCase();

  const result = todos.filter((todo) => {
    const matchStatus = filter === 'all' || todo.status === filter;
    const matchKeyword =
      keyword === '' ||
      todo.title.toLowerCase().includes(keyword) ||
      todo.note.toLowerCase().includes(keyword);
    return matchStatus && matchKeyword;
  });

  return result.sort((a, b) => {
    if (sortBy === 'oldest') {
      return a.createdAt.localeCompare(b.createdAt);
    }
    if (sortBy === 'status') {
      const diff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      if (diff !== 0) return diff;
    }
    
    if (sortBy === 'deadline') {
      if (a.dueAt && b.dueAt) {
        const diff = a.dueAt.localeCompare(b.dueAt);
        if (diff !== 0) return diff;
      } else if (a.dueAt) {
        return -1;
      } else if (b.dueAt) {
        return 1;
      }
    }
    
    // Default (dan pemecah seri): terbaru di atas
    return b.createdAt.localeCompare(a.createdAt);
  });
}