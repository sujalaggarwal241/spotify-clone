export default function ArtistSongRow(props :{
	index: number
	songTitle : string,
	streams: number,
	duration : string
}) {
    return (
      <div className="w-full h-14 px-2 flex items-center gap-4 rounded hover:bg-neutral-800">
				<div className="h-10 w-10 flex justify-center items-center font-bold">
					{props.index}
				</div>
				<div className="h-10 w-10 rounded overflow-hidden object-contain">
					<img src="/coverImages/8.jpg" alt="" />
				</div>
				<div className="flex flex-col w-125">
					<div className="font-bold">{props.songTitle}</div>
					<div></div>
				</div>
				<div className="flex flex-end">{props.streams}</div>
				<div className="flex-1"></div>
				<div className="mr-8">{props.duration}</div>
			</div>
    )
}