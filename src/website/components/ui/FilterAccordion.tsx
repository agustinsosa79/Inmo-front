import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FilterOption = {
  value: string;
  label: string;
  count: number;
};

const FilterAccordion = ({
  title,
  options,
  selectedValue,
  onSelect,
  defaultOpen = false,
}: {
  title: string;
  options: FilterOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-zinc-200 py-4">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between text-left cursor-pointer"
      >
        <span className="text-sm font-semibold uppercase tracking-wider text-zinc-900">
          {title}
        </span>
        <ChevronDown
          size={16}
          className={`text-zinc-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <ul className="mt-3 flex flex-col gap-1">
          {options.map((opt) => {
            const isActive = selectedValue === opt.value;
            const isDisabled = opt.count === 0 && !isActive;

            return (
              <li key={opt.value}>
                <button
                  type="button"
                  disabled={isDisabled}
                  onClick={() => onSelect(isActive ? "" : opt.value)}
                  className={`flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm transition cursor-pointer ${
                    isActive
                      ? "bg-red-800 text-white"
                      : isDisabled
                      ? "text-zinc-300 cursor-not-allowed"
                      : "text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  <span>{opt.label}</span>
                  <span className={isActive ? "text-white/80" : "text-zinc-400"}>
                    ({opt.count})
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FilterAccordion;