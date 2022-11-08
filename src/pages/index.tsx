import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { FiCircle, FiCheckCircle, FiEdit2, FiTrash2 } from "react-icons/fi";

const listButtonStyle = {
  color: "#9333ea",
  cursor: "default",
  borderColor: "#9333ea"
}

const useLightMode = () => {
  const [theme, setTheme] = useState<string>(typeof window !== 'undefined' ? localStorage.theme : 'light');
  const colorTheme = theme === 'light' ? 'dark' : 'light';

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove(colorTheme);
    root.classList.add(theme);

    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }

  }, [theme])

  return [colorTheme, setTheme];
}

const Home: NextPage = () => {
  const [savedItems, setSavedItems] = useState<string>('');
  const [items, setItems] = useState<{ id: number; text: string; checked: boolean }[]>(savedItems ? JSON.parse(savedItems) : []);
  const [editItem, setEditItem] = useState<number>(-1);
  const [showChecked, setShowChecked] = useState<boolean>(false);
  const [maxId, setMaxId] = useState<number>(0);
  const todoInput = useRef<HTMLInputElement>(null);
  const todoButton = useRef<HTMLButtonElement>(null);
  const [colorTheme, setTheme] = useLightMode();

  const addTodo = () => {
    if (todoInput.current === null || todoInput.current.value === '') return

    setItems([...items, { id: maxId, text: todoInput.current.value, checked: false }]);
    setMaxId(maxId + 1);
    todoInput.current.value = '';
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
  }

  const handleTodo = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editItem >= 0) {
      editTodo();
    } else {
      addTodo();
    };
  }

  useEffect(() => {
    window.localStorage.setItem('todos', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    const saved = localStorage.getItem('todos');

    if (saved) {
      setSavedItems(saved);
    }

    // TODO: Need to figure out how to save data on reload
    // const localItems = JSON.parse(window.localStorage.getItem('todos')) || [];

    // console.table(localItems);
    // if (localItems !== undefined) {
    //   setItems(localItems);
    // };
  }, [])

  useEffect(() => {
    items.map(item => {
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
  };

  const toggleAll = () => {
    const updatedItems = items.map(item => ({ id: item.id, text: item.text, checked: !showChecked }));
    setItems(updatedItems);
  }

  const removeAll = () => {
    const updatedItems = items.filter(item => item.checked !== showChecked);
    setItems(updatedItems);
  }

  const removeItem = (id: number) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
  }

  return (
    <>
      <Head>
        <title>What ToDo</title>
        <meta name="description" content="An app to keep up with things you need to do." />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <main className="container mx-auto min-h-screen flex justify-center">
        <div className="flex text-white flex-col items-center w-full sm:w-3/4 gap-4 p-5 mt-10">
          <h2 className="text-4xl font-extrabold">What <span className="text-purple-600">ToDo</span></h2>
          <div>
            <form className="grid" onSubmit={handleTodo}>
              <input className="border border-slate-600 transition-all duration-200 ease-in-out outline-none px-2 py-1 rounded bg-slate-600 hover:drop-shadow-purple-600]" autoFocus ref={todoInput} type="text" />
              <div className="m-1"></div>
              <button ref={todoButton}
                className="uppercase py-1.5 font-extrabold bg-purple-600 rounded duration-300 motion-safe:hover:bg-purple-800"
              >{
                  editItem >= 0
                    ? "Edit item"
                    : "Add item"
                }</button>
            </form>
          </div>

          <div className="flex w-full text-gray-500 mt-6 w-full">
            <button
              onClick={() => setShowChecked(false)}
              className="px-4 w-full font-bold transition-all duration-500 ease-in-out hover:text-purple-600 border-b-2 pb-2 border-gray-700"
              style={!showChecked ? listButtonStyle : {}}>
              Active items ({items.filter(item => item.checked === false).length})
            </button>
            <button
              onClick={() => setShowChecked(true)}
              className="px-4 w-full font-bold transition-all duration-500 ease-in-out hover:text-purple-600 border-b-2 pb-2 border-gray-700 hover:border-purple-600"
              style={showChecked ? listButtonStyle : {}}>
              Checked items ({items.filter(item => item.checked === true).length})
            </button>
          </div>

          <div className="flex flex-col gap-4 w-full justify-center border p-2 border-gray-700 rounded">
            {
              items && (items.filter(item => item.checked === showChecked).length === 0)
                ?
                <div className="text-center mt-2 p-4 text-gray-500">
                  No items found.
                </div>
                : <div className="flex gap-2 mt-2 place-content-between">
                  <button onClick={() => toggleAll()} className="flex items-center gap-2 py-0.5 px-4 text-sm text-gray-100 hover:translate-y-1 transition-all duration-300 ease-in-out">
                    {!showChecked
                      ? <>
                        <FiCheckCircle />
                        Check all
                      </>
                      : <>
                        <FiCircle />
                        Uncheck all
                      </>
                    }
                  </button>
                  <button onClick={() => removeAll()} className="flex items-center gap-2 py-0.5 px-4 text-sm text-red-600 hover:translate-y-1 transition-all duration-300 ease-in-out">
                    <FiTrash2 />
                    Delete all
                  </button>
                </div>

            }


            <div className="flex gap-2 flex-col w-full">
              {
                items?.filter(item => item.checked === showChecked).map(item => (
                  <div key={item.id} className="border border-slate-700 rounded p-2 justify-between flex items-start relative item-hover transition-all duration-100 ease-in-out"
                    style={{ textDecorationLine: item.checked ? "line-through" : 'none' }}>
                    <div className="flex gap-3">
                      <button onClick={() => toggleCheck(item.id)} className="text-md hover:text-purple-400 px-2 self-start pt-1">
                        {item.checked
                          ? <FiCheckCircle />
                          : <FiCircle />
                        }
                      </button>
                      <p className="first-letter:uppercase break-word">{item.text}</p>
                    </div>
                    <div className="flex sm:gap-3 self-start pt-1">
                      <button onClick={() => setEditItem(item.id)} className="text-sm hover:text-purple-400 px-2">
                        <FiEdit2 />
                      </button>
                      <button onClick={() => removeItem(item.id)} className="text-sm hover:text-purple-400 px-2">
                        <FiTrash2 />
                      </button>

                    </div>


                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

