type PlayIconProps = {
    active?: boolean;
  };
  
  export default function PlayIcon({ active = false }: PlayIconProps) {
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
        <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288z" />
      </svg>
    );
  }
  