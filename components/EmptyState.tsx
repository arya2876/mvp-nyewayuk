import React from "react";
import Heading from "./Heading";
import Link from "next/link";

interface EmptyProps {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
}

const EmptyState: React.FC<EmptyProps> = ({
  title = "Tidak Ada Hasil",
  subtitle = "Coba ubah atau hapus beberapa filter Anda.",
  showReset,
}) => {
  return (
    <div className="h-[60vh] flex flex-col gap-2 justify-center items-center">
      <Heading center title={title} subtitle={subtitle} />
      <div className="w-48 mt-4">
        {showReset && (
          <Link
            href="/"
            className="bg-neutral-700 border-[1px] border-white/20 text-white rounded hover:opacity-80 transition px-4 py-2 inline-block"
          >
            Hapus semua filter
          </Link>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
