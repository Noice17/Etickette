'use client';

import { useState } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import DropDownMenuItems from '../IndividualComponents/DropDownMenuItems';


type DropDownMenuProps = {
  onSelect: (view: "inbox" | "resolved") => void;
};

export default function DropDownMenu({ onSelect }: DropDownMenuProps) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="w-full font-montserrat pt-8">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-start gap-2 px-4 text-left mb-1"
            >
                <ChevronRightIcon
                    className={`w-5 h-5 transform transition-transform duration-300 ${isOpen ? 'rotate-90' : ''
                        }`}
                />
                <span className="font-semibold text-dark-text text-sm">Tickets</span>
            </button>

            <div
                className={`overflow-hidden transition-all duration-300 transform origin-top ${
                    isOpen ? 'opacity-100 scale-100 max-h-40' : 'opacity-0 scale-95 max-h-0'
                }`}
            >
                <DropDownMenuItems onSelect={onSelect}/>
            </div>
        </div>
    );
}
