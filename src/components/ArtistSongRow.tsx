import { useLikedSongs } from "../hooks/useLikedSongs"

export default function ArtistSongRow(props :{
	id : number
	index: number
	songTitle : string,
	streams: number,
	duration : string
	_id: any
}) {

	const {isLiked, toggleLike} = useLikedSongs(props._id)


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
			<div className="flex items-center">
				{isLiked ? (
				<svg
					onClick={() => toggleLike(props?._id)}
					className="w-4 h-4 text-[#1db954] cursor-pointer fill-white"
					
					viewBox="0 0 16 16"
				>
					<path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m11.748-1.97a.75.75 0 0 0-1.06-1.06l-4.47 4.47-1.405-1.406a.75.75 0 1 0-1.061 1.06l2.466 2.467 5.53-5.53z" />
				</svg>
				) : (
				<svg
				onClick={() => toggleLike(props?._id)}
					className="w-4 h-4 text-neutral-400 fill-white cursor-pointer"
					viewBox="0 0 24 24"
				>
					<path d="M11.999 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18m-11 9c0-6.075 4.925-11 11-11s11 4.925 11 11-4.925 11-11 11-11-4.925-11-11" /> 
					<path d="M17.999 12a1 1 0 0 1-1 1h-4v4a1 1 0 1 1-2 0v-4h-4a1 1 0 1 1 0-2h4V7a1 1 0 1 1 2 0v4h4a1 1 0 0 1 1 1" />
				</svg>
				)}
			</div>
			<div className="mr-8">{props.duration}</div>
		</div>
	)
}