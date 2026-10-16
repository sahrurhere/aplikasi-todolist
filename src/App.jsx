import { useMemo, useState } from 'react';
import TodoForm from './components/TodoForm';
import TodoCard from './components/TodoCard';
import FilterTabs from './components/FilterTabs';
import SearchBar from './components/SearchBar';
import { useTodos } from './hooks/useTodos';
import { countByStatus, getVisibleTodos } from './utils/todoFilters';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'oldest', label: 'Terlama' },
  { value: 'status', label: 'Status' },
];

function App() {
  const { todos, addTodo, updateTodo, deleteTodo } = useTodos();
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const counts = useMemo(() => countByStatus(todos), [todos]);
  const visibleTodos = useMemo(
    () => getVisibleTodos(todos, { filter, query, sortBy }),
    [todos, filter, query, sortBy]
  );

  function resetFilters() {
    setFilter('all');
    setQuery('');
  }

  let content;
  if (todos.length === 0) {
    content = (
      <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted">
        Belum ada tugas. Tambahkan tugas pertamamu!
      </p>
    );
  } else if (visibleTodos.length === 0) {
    content = (
      <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted">
        <p>Tidak ada tugas yang cocok.</p>
        <button
          type="button"
          onClick={resetFilters}
          className="mt-3 text-sm font-medium text-accent hover:underline"
        >
          Tampilkan semua tugas
        </button>
      </div>
    );
  } else {
    content = visibleTodos.map((todo) => (
      <TodoCard
        key={todo.id}
        todo={todo}
        onUpdate={updateTodo}
        onDelete={deleteTodo}
      />
    ));
  }

  return (
    <main className="mx-auto max-w-[720px] px-4 py-10">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">
          <span className="text-accent">✓</span> My To-Do
        </h1>
        <SearchBar value={query} onChange={setQuery} />
      </header>

      <TodoForm onAdd={addTodo} />

      <div className="mt-6">
        <FilterTabs active={filter} counts={counts} onChange={setFilter} />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-sm text-muted">
        <span>
          Menampilkan {visibleTodos.length} dari {todos.length} tugas
        </span>
        <label className="flex items-center gap-2">
          Urutkan
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="cursor-pointer rounded-lg border border-border bg-surface-2 px-2 py-1 text-text focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <section className="mt-4 space-y-3">{content}</section>
    </main>
  );
}

export default App;