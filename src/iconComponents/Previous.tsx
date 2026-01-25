type PreviousIconProps = {
    active?: boolean;
  };
  
  export default function PreviousIcon({ active = false }: PreviousIconProps) {
    return (
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        className={`
          h-4 w-4
          transition-colors
          ${active ? "fill-white" : "fill-neutral-400 group-hover:fill-white"}
        `}
      >
        <path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7z" />
      </svg>
    );
  }
  