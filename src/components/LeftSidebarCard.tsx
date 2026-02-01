"use client";

type SidebarItemProps = {
  title: string;
  subtitle: string;
  image: string;
  type: "album" | "artist" | "playlist";
  onClick?: () => void;
};

export default function LeftSidebarCard({
  title,
  subtitle,
  image,
  type,
  onClick,
}: SidebarItemProps) {
  const isArtist = type === "artist";

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 p-2 rounded-md hover:bg-neutral-800 transition cursor-pointer"
    >
      {/* Image */}
      <div
        className={`w-12 h-12 shrink-0 overflow-hidden bg-neutral-700
          ${isArtist ? "rounded-full" : "rounded-md"}
        `}
      >
        <img
          src={image? image : "/coverImages/8.jpg"}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Text */}
      <div className="flex flex-col leading-tight min-w-0">
        <span className="text-sm font-semibold text-white truncate">
          {title}
        </span>

        <span className="text-xs text-neutral-400 truncate">
          {type === "playlist" ? "Playlist" : subtitle}
        </span>
      </div>
    </div>
  );
}
