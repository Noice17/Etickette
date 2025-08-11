type DropDownMenuItemsProps = {
  onSelect: (view: "inbox" | "resolved") => void;
};

export default function DropDownMenuItems({ onSelect }: DropDownMenuItemsProps) {
  return (
    <div className="text-sm text-dark-text flex flex-col items-center text-left space-y-1">
      <p
        className="w-1/3 font-semibold cursor-pointer hover:text-[16px]"
        onClick={() => onSelect("inbox")}
      >
        Inbox
      </p>
      <p
        className="w-1/3 font-normal cursor-pointer hover:text-[16px]"
        onClick={() => onSelect("resolved")}
      >
        Resolved
      </p>
    </div>
  );
}
