type QueueIconProps = {
    active?: boolean;
  };
  
  export default function QueueIcon({ active = false }: QueueIconProps) {
    return (
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        className={`
          h-4 w-4
          transition-colors
          ${active ? "fill-black" : "fill-neutral-400 group-hover:fill-white"}
        `}
      >
        <path d="M15 15H1v-1.5h14zm0-4.5H1V9h14zm-14-7A2.5 2.5 0 0 1 3.5 1h9a2.5 2.5 0 0 1 0 5h-9A2.5 2.5 0 0 1 1 3.5m2.5-1a1 1 0 0 0 0 2h9a1 1 0 1 0 0-2z" />
      </svg>
    );
  }
  