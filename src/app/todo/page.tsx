"use client"

import React, { useEffect, useMemo, useState, type FormEvent} from "react"

type Todo = { id: string; title: string; done: boolean };
const STORAGE_KEY = "todo:v2";

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input ,setInput] = useState<string>("");
  const [editId, setEditId] = useState<string | null>(null);
  const [edittitle, setEditTitle] = useState<string>("");

  const isTodo = (x: unknown): x is Todo => {/* Todo */return true};

  useEffect(() => {/* load */}, []);
  useEffect(() => {/* persist */},[todos]);

  const isEditing = useMemo(() => editId !== null, [editId]);

  const addTodo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }
  const toggle = (id: string) => {};
  const remove = (id: string) => {};
  const startEdit = (id: string) => {};
  const cancelEdit = () => {};
  const saveEdit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <main>
      {isEditing && 
      <form onSubmit={addTodo} className="flex gap-2">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border px-3 py-2 rounded w-full text-black"
          type="text"
          placeholder="タスクを入力"
        />
        <button type="subumit" className="bg-blue-600 text-white px-4 py-2 rounded">
          追加
        </button>
      </form>}
      {isEditing && 
      <form onSubmit={saveEdit} className="flex gap-2">
        <input
          value={editTitle}
          onChange={(e) => ssetEditTitle(e.target.value)}
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
      </form>}
      <ul className="space-y-2">
        {todos.map((t) => (
          <li key={t.id} className="flex items-center gap-3">
            <input
              id={`todo-${t.id}`}
              type="checkbox"
              checked={t.done}
              onChange={() => ToggleEvent.id}
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