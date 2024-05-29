import React, { useCallback, useState } from "react"
import { NguzaContractAddress } from "../utils/const"
import { useAccount } from "wagmi";
import Web3 from "@/utils/web3";
import LENDING_PROTOCOL_ABI from "@/contracts/lendingprotocal.abi.json"

export type LoanIssue = {
  borrower: string;
  amount: number;
  repaymentDeadline: number;
  isActive: Boolean
};

export const useGetData = () => {
  const [data, setData] = useState<any>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<any>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { address } = useAccount();

  // const createPaymentLink = ()=>{
  //   console.log("clicked  222")
  // }




  const createPaymentLink = useCallback(
    async () => {
      console.log("clicked")

      if (!address || !window) {

        console.log("refused ",address)
        setError(address)
        
        
        
        return};

      try {
        setIsPending(true);
        const contract = await new Web3().contract(
          NguzaContractAddress,
          LENDING_PROTOCOL_ABI,
          address
        );
        setError(address)

        console.log("contract created :",contract)

        let loanResults = await contract.getAllLoans()
        setData(loanResults)
        console.log("here is the data :", loanResults)


      } catch (e: any) {
        console.log(e);
        setData(null);
        setIsSuccess(false);
        setError({ message: e.shortMessage ?? e });
        throw e;
      }
      finally {
        setIsPending(false);
      }

    }, [address]
  );

  const reset = useCallback(() => {
    setData(null);
    setIsSuccess(false);
    setError(null);
    setIsPending(false);
  }, []);


  return {
    isPending,
    isSuccess,
    reset,
    error,
    createPaymentLink,
    loansData: data
  };






}