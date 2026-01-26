

export default function AlbumRow(props : {
  index: number
  songTitle : string, 
  artistName : string, 
  duration : string
}) {
  return (
    <div className="flex h-14 gap-4 items-center rounded hover:bg-neutral-700 ">
      <div className="h-10 w-10 items-center flex justify-center">{props.index}</div>
      <div className="">
        <div className="font-bold">{props.songTitle}</div>
        <div className="text-sm">{props.artistName}</div>
      </div>
      <div className="flex-1"></div>
      <div className="mr-8">{props.duration}</div>
    </div>
  )
}