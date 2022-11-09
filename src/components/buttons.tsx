import { MouseEventHandler, ReactElement } from "react";
import { FiCircle, FiCheckCircle, FiEdit2, FiTrash2 } from "react-icons/fi";

type StatusButtonProps = {
  title: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  showChecked: boolean;
  count: number;
}

const StatusButton = ({ title, onClick, showChecked, count }: StatusButtonProps) => {
  const listButtonStyle = {
    color: "#9333ea",
    cursor: "default",
    borderColor: "#9333ea"
  }

  return (
    <button
      onClick={onClick}
      className="px-4 w-full font-bold transition-all duration-500 ease-in-out hover:text-purple-600 border-b-2 py-2 dark:border-gray-700 hover:border-purple-600"
      style={showChecked ? listButtonStyle : {}}>
      {title} ({count | 0})
    </button>
  )
}

type ActionButtonProps = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  icon: ReactElement;
  mediumSize?: boolean;
}

const ActionButton = ({ onClick, icon, mediumSize }: ActionButtonProps) => {
  return (
    <button onClick={onClick} className={`${mediumSize ? 'text-md pt-1' : 'text-sm'} hover:text-purple-400 px-2 self-start`}>
      {icon}
    </button>
  )
}

type HeaderActionButtonsProps = {
  items: { id: number; text: string; checked: boolean }[];
  showChecked: boolean;
  toggleAll: () => void;
  removeAll: () => void;
}

const HeaderActionButtons = ({ items, showChecked, toggleAll, removeAll }: HeaderActionButtonsProps) => {
  return (
    items && (items.filter(item => item.checked === showChecked).length === 0)
      ?
      <div className="text-center mt-2 p-4 text-gray-500">
        No items found.
      </div>
      :
      <div className="flex gap-2 mt-2 place-content-between">
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
  )
}

export { StatusButton, ActionButton, HeaderActionButtons }
