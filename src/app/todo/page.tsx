"use client"

import { useState } from "react"

type Todo = { id: string; title: string; done: boolean };

export default function TodoPage() {
  const [todos] = useState<Todo[]>([
    {id: "1", title: "買い物に行く", done: true },
    {id: "2", title: "メール返信する", done: true },
    {id: "3", title: "寝る", done: false },
    
  ]);

  return (
    <main className="mx-auto max-w-md p-4">
      <h1 className="text-xl font-bold mb-3">Todo</h1>
      <ul className="space-y-2">
        {todos.map((t) => (
          <li key={t.id} className="flex items-center gap-2">
            <span className="w-5 text-center">{t.done ? "✅" : "⬜️"}</span>
            <span>{t.title}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}