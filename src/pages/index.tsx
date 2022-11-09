import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { getCookie, setCookie } from 'cookies-next';
import { StatusButton, HeaderActionButtons } from "../components/buttons"
import Items from "../components/items"
import ThemeSwitch from "../components/theme"

const Home: NextPage = () => {
  const [items, setItems] = useState<{ id: number; text: string; checked: boolean }[]>([]);
  const [editItem, setEditItem] = useState<number>(-1);
  const [showChecked, setShowChecked] = useState<boolean>(false);
  const [maxId, setMaxId] = useState<number>(0);
  const todoInput = useRef<HTMLInputElement>(null);
  const todoButton = useRef<HTMLButtonElement>(null);

  const setLocalStorageItems = (items: { id: number; text: string; checked: boolean }[]) => {
    // localStorage.setItem('items', JSON.stringify(items));
    setCookie('items', items, { sameSite: 'lax' });
  }

  const addTodo = () => {
    if (todoInput.current === null || todoInput.current.value === '') return

    const updatedItems = items ? items.slice(0) : []
    updatedItems.push({ id: maxId, text: todoInput.current.value, checked: false });
    setItems(updatedItems);
    setMaxId(maxId + 1);
    todoInput.current.value = '';

    setLocalStorageItems(updatedItems);
  }

  const editTodo = () => {
    if (!todoInput.current) return

    const updatedItems = items.map(item => {

      if (item.id === editItem && todoInput.current) {
        return {
          id: item.id,
          text: todoInput.current.value,
          checked: item.checked
        }
      } else {
        return item;
      }
    })

    setItems(updatedItems);
    todoInput.current.value = '';
    setEditItem(-1);
    setLocalStorageItems(updatedItems);
  }

  const handleTodo = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editItem >= 0) {
      editTodo();
    } else {
      addTodo();
    }
  }

  useEffect(() => {
    const items2 = getCookie('items');

    if (typeof items2 !== 'undefined') {
      console.table(JSON.parse(items2!.toString()));
      setItems(JSON.parse(items2!.toString()));
    }
  }, [])

  useEffect(() => {
    items?.map(item => {
      if (item.id === editItem) {
        todoInput.current &&
          (todoInput.current.value = item.text);
      }
    })
    todoInput.current?.focus();
  }, [editItem]);

  const toggleCheck = (id: number) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        return { id: item.id, text: item.text, checked: !item.checked };
      } else {
        return item;
      }
    })
    setItems(updatedItems);
    setLocalStorageItems(updatedItems);
  };

  const toggleAll = () => {
    const updatedItems = items.map(item => ({ id: item.id, text: item.text, checked: !showChecked }));
    setItems(updatedItems);
    setLocalStorageItems(updatedItems);
  }

  const removeAll = () => {
    const updatedItems = items.filter(item => item.checked !== showChecked);
    setItems(updatedItems);
    setLocalStorageItems(updatedItems);
  }

  const removeItem = (id: number) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    setLocalStorageItems(updatedItems);
  }

  return (
    <>
      <Head>
        <title>What ToDo</title>
        <meta name="description" content="An app to keep up with things you need to do." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full min-h-screen bg-violet-50 dark:bg-slate-800">
        <ThemeSwitch />

        <div className="container mx-auto min-h-screen flex justify-center">
          <div className="flex  text-gray-700 dark:text-white flex-col items-center w-full lg:w-3/4 gap-4 p-5 mt-10">
            <h2 className="text-4xl font-extrabold">What <span className="text-purple-600">ToDo</span></h2>
            <div>
              <form className="grid" onSubmit={handleTodo}>
                <input className="border dark:border-slate-600 transition-all duration-200 ease-in-out outline-none px-2 py-1 rounded dark:bg-slate-600 hover:drop-shadow-purple-600]" autoFocus ref={todoInput} type="text" />
                <div className="m-1"></div>
                <button ref={todoButton}
                  className="uppercase py-1.5 font-extrabold text-white bg-purple-600 rounded duration-300 motion-safe:hover:bg-purple-800"
                >{
                    editItem >= 0
                      ? "Edit item"
                      : "Add item"
                  }</button>
              </form>
            </div>

            <div className="flex w-full text-gray-400 dark:text-gray-500 mt-6 w-full">
              <StatusButton
                title="Active items"
                onClick={() => setShowChecked(false)}
                showChecked={!showChecked}
                count={items?.filter(item => item.checked === false).length}
              />
              <StatusButton
                title="Checked items"
                onClick={() => setShowChecked(true)}
                showChecked={showChecked}
                count={items?.filter(item => item.checked === true).length}
              />
            </div>

            <div className="flex flex-col gap-4 w-full justify-center border p-2 border-gray-200 dark:border-gray-700 rounded">

              <HeaderActionButtons
                items={items}
                showChecked={showChecked}
                toggleAll={toggleAll}
                removeAll={removeAll}
              />

              <Items
                items={items}
                showChecked={showChecked}
                editItem={editItem}
                toggleCheck={toggleCheck}
                setEditItem={setEditItem}
                removeItem={removeItem}
              />
            </div>
          </div>
        </div>

      </main>
    </>
  );
};

export default Home;

