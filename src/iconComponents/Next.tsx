type NextIconProps = {
    active?: boolean;
  };
  
  export default function NextIcon({ active = false }: NextIconProps) {
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
        <path
          d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7z"
        />
      </svg>
    );
  }
  