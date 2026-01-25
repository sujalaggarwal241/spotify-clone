import Image from "next/image"

export default function Card() {
    return (
      <div className="flex flex-col shrink-0 gap-1">
        <Image  
          src="/coverImages/1.jpg"
          alt="coverimage"
          width={190}
          height={100}
          className="rounded "
        />
        <div className="text-xl font-bold -mb-1">Off the grid</div>
        <div >Kanye West</div>
      </div>
    )
  }