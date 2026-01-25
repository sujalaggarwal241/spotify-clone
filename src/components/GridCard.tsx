type GridCardProps = {
  title: string;
  imageUrl: string;
};

export default function GridCard({ title, imageUrl }: GridCardProps) {
  return (
    <div className="group flex items-center gap-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition cursor-pointer">
      {/* Image */}
      <div className="w-16 h-16 rounded-md overflow-hidden shrink-0">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title */}
      <div className="text-white text-lg font-semibold truncate">
        {title}
      </div>
    </div>
  );
}
