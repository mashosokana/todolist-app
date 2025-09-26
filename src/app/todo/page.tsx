"use client"

import React, { useEffect, useMemo, useState, useSyncExternalStore, type FormEvent} from "react"
import { isErrored } from "stream";

type Todo = {id: string; title: string; done: boolean};
const STORAGE_KEY = "todo:v2";

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");

  const isTodo = ( x: unknown) : x is Todo => {/* TODO */return true};

  const addTodo = (id: string) => {};
  const toggle = (id: string) => {};
  const remove = (id: string) => {};
  const startEdit = (id: string) => {};
  const cancelEdit = () => {};
  const saveEdit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <main>
      {!isEditing && 
        <form onSubmit={ddTodo} className="flex gar-2">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border px-3 py-2 rounded w-full text-black"
            type="text"
            placeholder="タスクを入力"
          />
          <button type="submit" className="bg-blue-600 text-white px-4py-2 rouded">
            追加
          </button>
        </form>
      }
      {isEditing && <form><input /><button /><button /></form>}
      <ul>{todos.map(t => <li><input /><label /><div><button /><button /></div></li>)}</ul>
    </main>
  );
}