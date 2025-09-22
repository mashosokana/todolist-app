"use client";

import React, { useEffect, useMemo, useState, type FormEvent } from "react";

type Todo = { id: string; title: string; done: boolean };
const STORAGE_KEY = "todo:v2";

export default function TodoPage() {
  // State（型を明示）
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");

  // 型ガード：isTodo（これがあると後段のfilterの型エラーが消えます）
  const isTodo = (x: unknown): x is Todo => {
    if (typeof x !== "object" || x === null) return false;
    const o = x as Record<string, unknown>;
    return (
      typeof o.id === "string" &&
      typeof o.title === "string" &&
      typeof o.done === "boolean"
    );
  };

  // load（最低限でも中身を書いておくと未使用警告が出ません）
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        setTodos(parsed.filter(isTodo));
      }
    } catch {
      // noop
    }
  }, []);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      // noop
    }
  }, [todos]);

  // Derived state
  const isEditing = useMemo(() => editId !== null, [editId]);

  // --- Functions（宣言だけ・最小処理だけ入れて型エラー回避） ---
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
  if (editId === id) cancelEdit(); // ← setEditId を使う経路
};

const startEdit = (id: string) => {
  const t = todos.find((x) => x.id === id);
  if (!t) return;
  setEditId(id);           // ← 使用
  setEditTitle(t.title);
};

const cancelEdit = () => {
  setEditId(null);         // ← 使用
  setEditTitle("");
};

const saveEdit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!editId) return;
  const value = editTitle.trim();
  if (!value) return cancelEdit();
  setTodos((prev) => prev.map((t) => (t.id === editId ? { ...t, title: value } : t)));
  cancelEdit();            // ← ここでも使用
};
// --- /Functions ---

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Todo Page</h1>

      {/* 追加フォーム（未編集中のみ） */}
      {!isEditing && (
        <form onSubmit={addTodo} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInput(e.target.value)
            }
            placeholder="タスクを入力"
            className="border px-3 py-2 rounded w-full text-black"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            追加
          </button>
        </form>
      )}

      {/* 編集フォーム（編集中のみ） */}
      {isEditing && (
        <form onSubmit={saveEdit} className="flex gap-2">
          <input
            type="text"
            value={editTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEditTitle(e.target.value)
            }
            placeholder="編集内容を入力"
            className="border px-3 py-2 rounded w-full text-black"
          />
          <button
            type="button"
            onClick={cancelEdit}
            className="px-4 py-2 rounded border"
          >
            キャンセル
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded">
            保存
          </button>
        </form>
      )}

      {/* リスト */}
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
