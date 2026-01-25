"use client";

import { useParams } from "next/navigation";

export default function Artist() {
  const params = useParams();
  const artistId = params.artistId;

  console.log("Artist ID:", artistId);

  const backgroundImage = `/data/artistImages/${artistId}.jpg`;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header / Navbar space is fixed, so main starts after it */}
      <main className="flex-1 flex flex-col overflow-auto">
        {/* Artist banner */}
        <div
          className="h-96 w-full flex items-end justify-start bg-cover bg-center p-6 relative"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="flex flex-col gap-4 text-white drop-shadow-lg">
            <div className="text-6xl font-black">Future</div>
            <div className="">275,379,314 monthly listeners</div>
          </div>
        </div>

        {/* Rest of the page */}
        <div className="flex-1 p-4">
          <p>More content goes here...</p>
        </div>
        <div className="flex-1 p-4">
          <p>More content goes here...</p>
        </div>
      </main>

      
    </div>
  );
}
