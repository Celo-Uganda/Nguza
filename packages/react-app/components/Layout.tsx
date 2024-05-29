import { FC, ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { useGetData } from "@/hooks/useGetData";


interface Props {
    children: ReactNode;


}
const Layout: FC<Props> = ({ children }) => {

    const { createPaymentLink, isPending,loansData } = useGetData();
    console.log("ddddd :",loansData,isPending)

    const testFunction =()=>{
        console.log("sssssssssssss");
            }

    return (
        <>
            <div className="bg-gypsum overflow-hidden flex flex-col min-h-screen">
                <Header />
                <div>
                    <button onClick={()=>createPaymentLink()} className="text-2xl">Ty it out</button>
                </div>
                <div className="py-16 max-w-7xl mx-auto space-y-8 sm:px-6 lg:px-8">
                    {children}
                </div>
                <Footer />
            </div>
        </>
    );
};

export default Layout;
