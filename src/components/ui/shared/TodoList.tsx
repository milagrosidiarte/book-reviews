"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function TodoList() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<string[]>([]);

  function addTask() {
    if (!task.trim()) return;
    setTasks([...tasks, task.trim()]);
    setTask("");
  }

  return (
    <div className="w-full max-w-md flex flex-col gap-4">
      <div className="flex gap-2">
        <Input
          placeholder="Escribe una tarea..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <Button onClick={addTask}>Agregar</Button>
      </div>

      <div className="flex flex-col gap-2">
        {tasks.map((t, idx) => (
          <Card key={idx} className="p-4">
            {t}
          </Card>
        ))}
      </div>
    </div>
  );
}
