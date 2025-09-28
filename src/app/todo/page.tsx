"use client"

import React, { useEffect, useMemo, useState, type FormEvent } from "react"

type Todo = { id: string; title: string; done: boolean };
const STORAGE_KEY = "todo:v2";

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");

  const isTodo = (x: unknown): x is Todo => {
    if (typeof x !== "object" || x === null) {
      return false;
    }

    const candidate = x as Record<string, unknown>;

    return (
      typeof candidate.id === "string" &&
      typeof candidate.title === "string" &&
      typeof candidate.done === "boolean"
    );
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === null) {
        return;
      }

      const parsed: unknown = JSON.parse(stored);
      if (!Array.isArray(parsed)) {
        return;
      }

      const validTodos = parsed.filter(isTodo);
      setTodos(validTodos);
    } catch (error) {
      console.error("Failed to load todos", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error("Failed to persist todos", error);
    }
  }, [todos]);

  const isEditing = useMemo(() => editId !== null, [editId]);

  const addTodo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const title = input.trim();
    if (!title) {
      return;
    }

    setTodos((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title,
        done: false,
      },
    ]);
    setInput("");
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTitle("");
  };

  const toggle = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              done: !todo.done,
            }
          : todo
      )
    );
  };

  const startEdit = (id: string) => {
    const target = todos.find((todo) => todo.id === id);
    if (!target) {
      return;
    }

    setEditId(id);
    setEditTitle(target.title);
  };

  const remove = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));

    if (editId === id) {
      cancelEdit();
    }
  };

  const saveEdit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editId === null) {
      return;
    }

    const title = editTitle.trim();
    if (!title) {
      return;
    }

    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === editId
          ? {
              ...todo,
              title,
            }
          : todo
      )
    );

    cancelEdit();
  };

  return (
    <main>
      {!isEditing && (
        <form onSubmit={addTodo} className="flex px-4 py-4 gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border px-3 py-2 rounded w-full text-black"
            type="text"
            placeholder="タスクを入力"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            追加
          </button>
        </form>
      )}
      {isEditing && (
        <form onSubmit={saveEdit} className="flex gap-2">
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="border px-3 py-2 rounded w-full text-black"
            type="text"
            placeholder="編集内容を入力"
          />
          <button
            type="button"
            onClick={cancelEdit}
            className="px-4 py-2 rounded border"
          >
            キャンセル
          </button>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            保存
          </button>
        </form>
      )}
      <ul className="space-y-2">
        {todos.map((t) => (
          <li key={t.id} className="flex px-5 gap-3">
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
            <div className="mlauto flex gap-2">
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
