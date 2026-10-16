import TodoForm from './components/TodoForm';
import TodoCard from './components/TodoCard';
import { useTodos } from './hooks/useTodos';

function App() {
  const { todos, addTodo, updateTodo, deleteTodo } = useTodos();

  return (
    <main className="mx-auto max-w-[720px] px-4 py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">
          <span className="text-accent">✓</span> My To-Do
        </h1>
      </header>

      <TodoForm onAdd={addTodo} />

      <section className="mt-6 space-y-3">
        {todos.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted">
            Belum ada tugas. Tambahkan tugas pertamamu!
          </p>
        ) : (
          todos.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onUpdate={updateTodo}
              onDelete={deleteTodo}
            />
          ))
        )}
      </section>
    </main>
  );
}

export default App;