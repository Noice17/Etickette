export default function PlaceholderTicketViewing() {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center text-border-blue">
            <div className="w-3/5 h-[70%] bg-no-repeat bg-cover bg-center mb-4"
                style={{ backgroundImage: "url('/ticket-background.png')" }} />
            <p className="font-extrabold text-xl">Select a Ticket to Read</p>
            <p className="font-medium text-sm">No Ticket Selected</p>
        </div>
    );
}