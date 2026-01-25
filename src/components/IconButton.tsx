type IconButtonProps = {
    children: React.ReactNode;
    label: string;
    active?: boolean;
    onClick?: () => void;
  };
  
  export default function IconButton({
    children,
    label,
    active = false,
    onClick,
  }: IconButtonProps) {
    return (
      <button
        aria-label={label}
        onClick={onClick}
        className={`
          h-8 w-8
          flex items-center justify-center
          rounded-full
          transition
          ${active ? "bg-neutral-700" : "hover:bg-neutral-700/60"}
        `}
      >
        {children}
      </button>
    );
  }
  