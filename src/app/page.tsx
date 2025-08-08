import TodoList from "@/components/shared/TodoList";


export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8">Mi lista de tareas</h1>
      <TodoList />
    </main>
  );
}
