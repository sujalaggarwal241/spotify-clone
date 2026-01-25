type SpeakerIconProps = {
    active?: boolean;
  };
  
  export default function SpeakerIcon({ active = false }: SpeakerIconProps) {
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
        <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.64 3.64 0 0 1-1.33-4.967 3.64 3.64 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.14 2.14 0 0 0 0 3.7l5.8 3.35V2.8zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88" />
<path d="M11.5 13.614a5.752 5.752 0 0 0 0-11.228v1.55a4.252 4.252 0 0 1 0 8.127z" />

      </svg>
    );
  }
  