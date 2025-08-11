export default function NewTicket(){
    return(
        <div className=" w-fit font-montserrat bg-blue-active text-white m-2 py-3 px-4 rounded-lg cursor-pointer">
            <p className="text-xs font-semibold">Client Sender</p>
            <p className="text-lg font-bold">Ticket # - Ticket Title</p>
            <p className="text-[11px] font-light">Ticket description snippet here. It will...</p>
            <div className="w-64 flex flex-row justify-between font-normal text-center mt-2">
                <p className="text-[9px] w-[30%] border border-border-blue py-0.5 rounded-lg bg-gray-category">
                    Category
                </p>
                <p className="text-[9px] w-[30%] border border-border-blue py-0.5 rounded-lg bg-yellow-mid">
                    Mid
                </p>
                <p className="text-[9px] w-[30%] border border-border-blue py-0.5 rounded-lg bg-white text-blue-active">
                    Open
                </p>
            </div>
        </div>
    );
}