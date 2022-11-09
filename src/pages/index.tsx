import { type NextPage } from "next";
import Head from "next/head";
import { useContext, useEffect, useRef, useState } from "react";
import { FiCircle, FiCheckCircle, FiEdit2, FiTrash2 } from "react-icons/fi";
import MyThemeContext from "../components/myThemeContext";

const listButtonStyle = {
  color: "#9333ea",
  cursor: "default",
  borderColor: "#9333ea"
}

const Home: NextPage = () => {
  const [savedItems, setSavedItems] = useState(typeof window !== 'undefined' ? localStorage.getItem('items') : []);
  const [items, setItems] = useState<{ id: number; text: string; checked: boolean }[]>([]);
  const [editItem, setEditItem] = useState<number>(-1);
  const [showChecked, setShowChecked] = useState<boolean>(false);
  const [maxId, setMaxId] = useState<number>(0);
  const todoInput = useRef<HTMLInputElement>(null);
  const todoButton = useRef<HTMLButtonElement>(null);
  const themeCtx: { isDarkMode?: boolean; toggleThemeHandler: () => void } =
    useContext(MyThemeContext);

  function toggleThemeHandler(): void {
    themeCtx.toggleThemeHandler();
  }

  const setLocalStorageItems = (items: { id: number; text: string; checked: boolean }[]) => {
    localStorage.setItem('items', JSON.stringify(items));
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
    const localItems = JSON.parse(window.localStorage.getItem('items')!);

    let max = -1;
    localItems.map((item: any) => {
      if (max < item.id) {
        max = item.id
      }
    })

    setMaxId(max + 1);
    setItems(localItems);
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

        <div className="flex justify-center">
          <button
            type="button"
            className="flex mt-4 border-2 border-slate-300 dark:border-slate-700 rounded-3xl px-2 py-1.5 text-black dark:text-white"
            onClick={toggleThemeHandler}
          >

            <div className="opacity-100 dark:opacity-0 fill-slate-800 w-4" >
              <svg viewBox="0 0 17 16" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.914 0a6.874 6.874 0 0 0-1.26 3.972c0 3.875 3.213 7.017 7.178 7.017.943 0 1.843-.178 2.668-.5C15.423 13.688 12.34 16 8.704 16 4.174 16 .5 12.41.5 7.982.5 3.814 3.754.389 7.914 0z" fillRule="evenodd"></path>
              </svg>
            </div>
            <div className="opacity-0 dark:opacity-100 fill-yellow-200 w-4" >
              <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.828 5.243L2.343 3.757a1 1 0 0 1 1.414-1.414l1.486 1.485a5.027 5.027 0 0 0-1.415 1.415zM7 3.1V1a1 1 0 1 1 2 0v2.1a5.023 5.023 0 0 0-2 0zm3.757.728l1.486-1.485a1 1 0 1 1 1.414 1.414l-1.485 1.486a5.027 5.027 0 0 0-1.415-1.415zM12.9 7H15a1 1 0 0 1 0 2h-2.1a5.023 5.023 0 0 0 0-2zm-.728 3.757l1.485 1.486a1 1 0 1 1-1.414 1.414l-1.486-1.485a5.027 5.027 0 0 0 1.415-1.415zM9 12.9V15a1 1 0 0 1-2 0v-2.1a5.023 5.023 0 0 0 2 0zm-3.757-.728l-1.486 1.485a1 1 0 0 1-1.414-1.414l1.485-1.486a5.027 5.027 0 0 0 1.415 1.415zM3.1 9H1a1 1 0 1 1 0-2h2.1a5.023 5.023 0 0 0 0 2zM8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" fillRule="evenodd"></path>
              </svg>
            </div>
          </button>
        </div>


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
              <button
                onClick={() => setShowChecked(false)}
                className="px-4 w-full font-bold transition-all duration-500 ease-in-out hover:text-purple-600 border-b-2 py-2 dark:border-gray-700"
                style={!showChecked ? listButtonStyle : {}}>
                Active items ({items?.filter(item => item.checked === false).length})
              </button>
              <button
                onClick={() => setShowChecked(true)}
                className="px-4 w-full font-bold transition-all duration-500 ease-in-out hover:text-purple-600 border-b-2 py-2 dark:border-gray-700 hover:border-purple-600"
                style={showChecked ? listButtonStyle : {}}>
                Checked items ({items?.filter(item => item.checked === true).length})
              </button>
            </div>

            <div className="flex flex-col gap-4 w-full justify-center border p-2 border-gray-200 dark:border-gray-700 rounded">
              {
                items && (items.filter(item => item.checked === showChecked).length === 0)
                  ?
                  <div className="text-center mt-2 p-4 text-gray-500">
                    No items found.
                  </div>
                  : <div className="flex gap-2 mt-2 place-content-between">
                    <button onClick={() => toggleAll()} className="flex items-center gap-2 py-0.5 px-4 text-sm text-gray-800 dark:text-gray-100 hover:translate-y-1 transition-all duration-300 ease-in-out">
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
                    // <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded p-2 justify-between flex items-start relative item-hover transition-all duration-100 ease-in-out"
                    <div key={item.id} className={`${item.id === editItem ? 'hover-effect' : ''} border border-gray-200 dark:border-gray-700 rounded p-2 justify-between flex items-start relative item-hover transition-all duration-100 ease-in-out`}
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
        </div>

      </main>
    </>
  );
};

export default Home;


