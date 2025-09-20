"use client";

import React, { useEffect, useMemo, useState, type FormEvent } from "react";

type Todo = { id: string; title: string; done: boolean };
const STORAGE_KEY = "todo:v2";

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");

  // Load from localStorage on mount
  const isTodo = (x: unknown): x is Todo => {
    if (typeof x !== "object" || x === null) return false;
    const o = x as Record<string, unknown>;
    return (
      typeof o.id === "string" &&
      typeof o.title === "string" &&
      typeof o.done === "boolean"
    );
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed)) setTodos(parsed.filter(isTodo));
      }
    } catch {
      // ignore malformed storage
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      // ignore quota errors
    }
  }, [todos]);

  const isEditing = useMemo(() => editId !== null, [editId]);

  const addTodo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = input.trim();
    if (!value) return;
    const todo: Todo = { id: crypto.randomUUID(), title: value, done: false };
    setTodos((prev) => [todo, ...prev]);
    setInput("");
  };

  const toggle = (id: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const remove = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    if (editId === id) cancelEdit();
  };

  const startEdit = (id: string) => {
    const t = todos.find((x) => x.id === id);
    if (!t) return;
    setEditId(id);
    setEditTitle(t.title);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTitle("");
  };

  const saveEdit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editId) return;
    const value = editTitle.trim();
    if (!value) return cancelEdit();
    setTodos((prev) => prev.map((t) => (t.id === editId ? { ...t, title: value } : t)));
    cancelEdit();
  };

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Todo Page</h1>

      {/* Add form */}
      {!isEditing && (
        <form onSubmit={addTodo} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            placeholder="タスクを入力"
            className="border px-3 py-2 rounded w-full text-black"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            追加
          </button>
        </form>
      )}

      {/* Edit form */}
      {isEditing && (
        <form onSubmit={saveEdit} className="flex gap-2">
          <input
            type="text"
            value={editTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditTitle(e.target.value)}
            placeholder="編集内容を入力"
            className="border px-3 py-2 rounded w-full text-black"
          />
          <button type="button" onClick={cancelEdit} className="px-4 py-2 rounded border">
            キャンセル
          </button>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            保存
          </button>
        </form>
      )}

      <ul className="space-y-2">
        {todos.map((t) => (
          <li key={t.id} className="flex items-center gap-3">
            <input
              id={`todo-${t.id}`}
              type="checkbox"
              checked={t.done}
              onChange={() => toggle(t.id)}
            />
            <label
              htmlFor={`todo-${t.id}`}
              className={t.done ? "line-through text-gray-500" : ""}
            >
              {t.title}
            </label>
            <div className="ml-auto flex gap-2">
              <button
                type="button"
                onClick={() => startEdit(t.id)}
                className="px-2 py-1 text-sm border rounded"
                disabled={isEditing}
              >
                編集
              </button>
              <button
                type="button"
                onClick={() => remove(t.id)}
                className="px-2 py-1 text-sm border rounded text-red-600"
              >
                削除
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
