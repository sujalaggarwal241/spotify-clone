type PauseIconProps = {
    active?: boolean;
  };
  
  export default function PauseIcon({ active = false }: PauseIconProps) {
    return (
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        className={`
          h-4 w-4
          transition-colors
          fill-white
        `}
      >
        <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7z" />
      </svg>
    );
  }
  