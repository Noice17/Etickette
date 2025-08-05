"use client";

import Link from "next/link";

export default function Navbar(){
    return(
        <header className="fixed top-0 left-0 right-0 h-16 bg-indigo-800 shadow z-50 flex items-center px-6">
            <img src="/etickette-brand.svg" alt="Etickette Logo" className="h-full py-4"/>
        </header>
    )
}
