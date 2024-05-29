import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useGetData } from "@/hooks/useGetData";

export default function Home() {
    const [userAddress, setUserAddress] = useState("");
    const [isMounted, setIsMounted] = useState(false);
    const { address, isConnected } = useAccount();

    const { createPaymentLink, isPending,loansData,error } = useGetData();
    console.log("ddddd :",loansData,isPending)


    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isConnected && address) {
            setUserAddress(address);
        }
    }, [address, isConnected]);

    if (!isMounted) {
        return null;
    }

    const tt = async ()=>{
console.log("clicked") 
   }


    return (
        <div className="flex flex-col justify-center items-center">
            <div className="h1">
                There you go... a canvas for your next Celo project!
            </div>
            {isConnected ? (
                <div className="h2 text-center">
                    Your address: {userAddress}
                </div>
            ) : (
                <div>No Wallet Connected</div>
            )}
<div>
    Error :{error}
</div>
        
            <div>
                <button onClick={()=>tt()} className="text-3xl bg-blue-200 text-black border">test button</button>
            </div>
        </div>
    );
}


// import { useEffect, useState, useCallback } from "react";
// import { useAccount } from "wagmi";
// import { useGetData } from "@/hooks/useGetData";

// export default function Home() {
//     const [userAddress, setUserAddress] = useState("");
//     const [isMounted, setIsMounted] = useState(false);
//     const { address, isConnected } = useAccount();
//     const { createPaymentLink, isPending, loansData } = useGetData();

//     useEffect(() => {
//         setIsMounted(true);
//     }, []);

//     useEffect(() => {
//         if (isConnected && address) {
//             setUserAddress(address);
//         }
//     }, [address, isConnected]);

//     const handleClick = useCallback(() => {
//         console.log("Button clicked");
//     }, []);

//     if (!isMounted) {
//         return null;
//     }

//     return (
//         <div className="flex flex-col justify-center items-center">
//             <h1>There you go... a canvas for your next Celo project!</h1>
//             {isConnected ? (
//                 <h2 className="text-center">Your address: {userAddress}</h2>
//             ) : (
//                 <div>No Wallet Connected</div>
//             )}

//             <div>
//                 <button
//                     onClick={handleClick}
//                     className="text-3xl bg-blue-200 text-black border"
//                 >
//                     Test Button
//                 </button>
//             </div>

//             <div>
//                 {/* Displaying data for debugging purposes */}
//                 <pre>{JSON.stringify(loansData, null, 2)}</pre>
//                 <div>{isPending ? "Loading data..." : "Data loaded"}</div>
//             </div>
//         </div>
//     );
// }
