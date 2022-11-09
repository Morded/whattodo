import { FiCircle, FiCheckCircle, FiEdit2, FiTrash2 } from "react-icons/fi";
import { ActionButton } from "../components/buttons"

type ItemsProps = {
  items: { id: number; text: string; checked: boolean }[];
  showChecked: boolean;
  editItem: number;
  toggleCheck: (id: number) => void;
  setEditItem: (id: number) => void;
  removeItem: (id: number) => void;
}

export default function Items({ items, showChecked, editItem, toggleCheck, setEditItem, removeItem }: ItemsProps) {
  return (
    < div className="flex gap-2 flex-col w-full" >
      {
        items?.filter(item => item.checked === showChecked).map(item => (
          <div key={item.id} className={`${item.id === editItem ? 'hover-effect' : ''} border border-gray-200 dark:border-gray-700 rounded p-2 justify-between flex items-start relative item-hover transition-all duration-100 ease-in-out`}
            style={{ textDecorationLine: item.checked ? "line-through" : 'none' }}>
            <div className="flex gap-3">
              <ActionButton
                onClick={() => toggleCheck(item.id)}
                icon={item.checked
                  ? <FiCheckCircle />
                  : <FiCircle />
                }
                mediumSize={true}
              />
              <p className="first-letter:uppercase break-all sm:break-word">{item.text}</p>
            </div>
            <div className="flex sm:gap-3 self-start pt-1">
              <ActionButton
                onClick={() => setEditItem(item.id)}
                icon={<FiEdit2 />}
              />
              <ActionButton
                onClick={() => removeItem(item.id)}
                icon={<FiTrash2 />}
              />

            </div>


          </div>
        ))
      }
    </div >
  )
}

