import { ReactNode } from "react";

export default function Card({ children }: { children: ReactNode }) {
    return (
        <div className="
            bg-orange-50
            shadow-[0_20px_60px_rgba(0,0,0,0.4)]
            hover:shadow-[0_30px_90px_rgba(0,0,0,0.5)]
            rounded-3xl
            p-12
            text-neutral-500
            flex justify-center items-center
            backdrop-blur-xl
            transition-all duration-300
            scale-105
        ">
            {children}
        </div>
    );
}
