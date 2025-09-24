"use client"

import React, {useEffect, useMemo, useState, type FormEvent} from "react"

// 1) Type
type Todo = {id: string; title: string; done: boolean};
const STORAGE_KEY = "todo:v2"

// 2) Component
export default function TodoPage () {
  // State（型に注意）  
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] =useState<string>("")
  
  // 型ガード（骨組みなので一旦 true でOK）
  const isTodo = (x: unknown): x is Todo => {
    //TODO
    return true;
  };
  
  // Effects: load
  useEffect(() => {
  
  },[]);
  
  // Effects: persist
  useEffect(() => {
  
  },[todos]);

  // Derived  
  const isEditing = useMemo(() => editId !==null, [editId]);

  // Functions（宣言だけにしてTODOコメント）
  const addTodo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const toggle = (id: string) => {

  };

  const remove = (id: string) => {

  };

  const startEdit = (id: string) => {

  };

  const cancelEdit = () => {

  };

  const saveEdit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

  };

  //UI
  return (
    <main className="p-6 spase-y-6">
      <h1 className="text-2xl font-bold">Todo Page</h1>

      {!isEditing && (
        <form onSubmit={addTodo} className="flex gap-2">

         <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="タスクを入力"
          className="border px-3 py-2 rounded w-full text-black"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">追加</button>        
        </form>
      )}

      {isEditing && (
        <form onSubmit={saveEdit} className="flex gap-2">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="編集内容を入力"
            className="border px-3 py-2 rounded w-full text-black"
          />
          <button type="button" onClick={cancelEdit} className="px-4 py-2 rounded border">
            キャンセル
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded">保存</button>
        </form>
      )}

      <ul className=" space-y-2">
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
              className={t.done ? "line-though text-gray-500" : ""}
            >
             {t.title}
            </label>
            <div className="ml-auto flex gap-2">
              <button
                onClick={() => startEdit(t.id)}
                className="px-2 py-1 text-sm border rounded"
                disabled={isEditing}
              >
                編集
              </button>
              <button
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

