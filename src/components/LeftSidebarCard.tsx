import Image from "next/image";

type SidebarItemProps = {
  title: string;
  subtitle: string;
  image: string;
  type: "album" | "artist";
};

export default function LeftSidebarCard({
  title,
  subtitle,
  image,
  type,
}: SidebarItemProps) {
  return (
    <div className="flex items-center gap-4 p-2 rounded-md hover:bg-neutral-800 transition cursor-pointer">
      {/* Image Wrapper */}
      <div
        className={`w-12 h-12 shrink-0 flex items-center justify-center overflow-hidden bg-neutral-700
          ${type === "artist" ? "rounded-full " : "rounded-md"}
        `}
      >
        <img
          src={image}
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
          {subtitle}
        </span>
      </div>
    </div>
  );
}
