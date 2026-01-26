import LeftSidebarCard from "./LeftSidebarCard"
export default function LeftSidebar() {


    return (
      <aside className="w-70 h-full overflow-auto overscroll-contain bg-neutral-900 rounded-xl p-4">

        <div className="sticky top flex flex-col gap-3 ">  
          <div className="flex gap-2 items-center">
            <div className="font-bold">Your Library</div>
            <div className="flex-1"></div>
            <div className="h-8 w-8 rounded-full bg-neutral-800 flex justify-center p-auto items-center text-3xl">+</div>
          </div> 

          <div className="text-sm flex gap-2">
          <button className="px-3 py-1 rounded-full bg-neutral-800 font-medium text-sm ">
            Playlist 
          </button>  
          <button className="px-3 py-1 rounded-full bg-neutral-800 font-medium text-sm">
            Artists
          </button>
          <button className="px-3 py-1 rounded-full bg-neutral-800 font-medium text-sm">
            Albums
          </button>
        </div>
        </div>


        <div className="flex flex-col gap-2 py-4"> 
          <LeftSidebarCard title={"Kanye West"} subtitle={"Artist"} image={'/artistImages/1.jpg'} type="artist" />
          <LeftSidebarCard title={"Donda"} subtitle={"Album: Kanye West"} image={'/artistImages/1.jpg'} type="album" />
          <LeftSidebarCard title={"Kanye West"} subtitle={"Artist"} image={'/artistImages/1.jpg'} type="artist" />
          <LeftSidebarCard title={"Kanye West"} subtitle={"Artist"} image={'/artistImages/1.jpg'} type="artist" />
          <LeftSidebarCard title={"Kanye West"} subtitle={"Artist"} image={'/artistImages/1.jpg'} type="artist" />
          <LeftSidebarCard title={"Kanye West"} subtitle={"Artist"} image={'/artistImages/1.jpg'} type="artist" />
        </div>
      </aside>
    )
}