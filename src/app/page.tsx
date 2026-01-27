import GridCard from "@/components/GridCard";
import Card from "@/components/Card";
import { songs } from "../../public/data/songs";
export default function Home() {
  return (
    <div className="bg-neutral-900 w-full rounded-xl gap-6 flex flex-col rounded-xl">
      <div className="flex items-center gap-4 sticky top-0 bg-neutral-900 py-5 pl-12 w-full rounded-xl">
        <button className="px-5 py-2 rounded-full bg-white text-black font-medium text-sm ">
          All
        </button>  
        <button className="px-5 py-2 rounded-full bg-white text-black font-medium text-sm">
          Music
        </button>
        <button className="px-5 py-2 rounded-full bg-white text-black font-medium text-sm">
          Podcast
        </button>
      </div>
      <div className="flex flex-col gap-6 px-12 rounded-xl"> 
      <div className="grid grid-cols-4 gap-2 ">
        <GridCard imageUrl="/coverImages/14.jpg" title="Liked Songs"/>
        <GridCard imageUrl="/coverImages/3.jpg" title="Urban Vibes"/>
        <GridCard imageUrl="/artistImages/1.jpg" title="Ava Collins"/>
        <GridCard imageUrl="/coverImages/5.jpg" title="Lofi Nights"/>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
        <div className="font-bold text-2xl">Recently Played</div>
        <div>Show all</div>
        </div>
        <div className="flex overflow-x-auto gap-4 whitespace-nowrap">
          {songs.map((song) => (
            <Card song={song} />
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
