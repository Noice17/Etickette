'use client';
import { Ticket } from 'phosphor-react';

export default function Toolbar() {
    return (
        <div className='w-full pt-6'>
            <Ticket 
                className="text-icons w-1/2 h-[6%] rotate-60 mx-auto" 
                weight="fill" // or "regular", "fill", etc.
            />
        </div>
    );
}
