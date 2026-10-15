import { useTodos } from './hooks/useTodos';

function App() {
  const { todos, addTodo, deleteTodo } = useTodos();

  return (
    <main className="mx-auto max-w-[720px] px-4 py-10">
      <h1 className="text-3xl font-bold">
        <span className="text-accent">✓</span> My To-Do
      </h1>

      <button
        onClick={() => addTodo({ title: `Tugas uji ${todos.length + 1}` })}
        className="mt-6 rounded-lg bg-accent px-4 py-2 font-semibold text-on-accent transition hover:bg-accent-hover"
      >
        Tambah tugas uji
      </button>

      <ul className="mt-6 space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between rounded-xl border border-border bg-surface p-4"
          >
            <span>{todo.title}</span>
            <button onClick={() => deleteTodo(todo.id)} className="text-danger">
              Hapus
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;