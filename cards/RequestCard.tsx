import Image from "next/image";
import { useRouter } from "next/navigation";

interface JoinRequestCardProps {
  id: string;
  name: string;
  username: string;
  imgUrl: string;
  onAccept: () => void;
  onReject: () => void;
}

export default function JoinRequestCard({
  id,
  name,
  username,
  imgUrl,
  onAccept,
  onReject,
}: JoinRequestCardProps) {
  const router = useRouter();

  return (
    <article className="flex justify-between gap-4 rounded-xl bg-dark-3 p-4 items-center border border-dark-4 hover:border-primary-500 transition">
      {/* User Info */}
      <div className="flex flex-1 items-center gap-3">
        <div className="relative h-12 w-12">
          <Image
            src={imgUrl || "/assets/profile.svg"}
            alt="user_logo"
            fill
            className="rounded-full object-cover"
          />
        </div>

        <div className="flex flex-col max-w-[150px] xs:max-w-none">
          <h4 className="text-[16px] font-semibold text-light-1 truncate">
            {name}
          </h4>
          <p className="text-[14px] text-gray-1 truncate">@{username}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onAccept()}
          className="px-3 py-1.5 rounded-lg bg-green-600 text-light-1 text-sm font-semibold hover:bg-green-700 transition"
        >
          Accept
        </button>

        <button
          onClick={() => onReject() }
          className="px-3 py-1.5 rounded-lg bg-red-600 text-light-1 text-sm font-semibold hover:bg-red-700 transition"
        >
          Reject
        </button>
      </div>
    </article>
  );
}
