import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import SafeSendEth from "../ABIs/SafeSendEth.json";
import { parseEther } from "viem";

export default function Home() {
  const [receiver, setReceiver] = useState("");
  const [sender, setSender] = useState("");
  const [value, setValue] = useState("");

  function useContractCall(
    functionName: string,
    args: string[],
    value?: string
  ) {
    const {
      config,
      error: prepareError,
      isError: isPrepareError,
    } = usePrepareContractWrite({
      address: "0xBFA223E28B3B9d0B344eBE3FCB976Bdd173ACCaE",
      abi: SafeSendEth.abi,
      functionName,
      args,
      value: value ? parseEther(value) : undefined,
    });

    const { data, isLoading, isSuccess, write, error, isError } =
      useContractWrite({
        ...config,
        onSettled(data, error) {
          console.log("Settled", { data, error });
        },
      });

    return {
      prepareError,
      isPrepareError,
      data,
      isLoading,
      isSuccess,
      write,
      error,
      isError,
    };
  }

  const {
    data: setReceiverData,
    isLoading: setReceiverIsLoading,
    isSuccess: setReceiverIsSuccess,
    write: writeSetReceiver,
  } = useContractCall("setReceiver", [receiver]);

  const {
    data: setSenderData,
    isLoading: setSenderIsLoading,
    isSuccess: setSenderIsSuccess,
    write: writeSetSender,
  } = useContractCall("setSender", [sender]);

  const {
    isPrepareError: isSendPrepareError,
    prepareError: sendPrepareError,
    data: sendData,
    isLoading: sendIsLoading,
    isSuccess: sendIsSuccess,
    write: writeSend,
    isError: sendIsError,
    error: sendError,
  } = useContractCall("sendEth", [receiver], value);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        Receiver: {receiver}
        <br />
        Sender: {sender}
        <ConnectButton />
      </div>
      <div>
        {/* Set Receiver */}
        <div>
          <input
            type="text"
            placeholder="receiver"
            className="border-2 border-gray-500"
            onChange={(e) => setReceiver(e.target.value)}
          />
          <button
            disabled={!writeSetReceiver}
            onClick={() => writeSetReceiver?.()}
          >
            Set Receiver
          </button>
          {setReceiverIsLoading && <div>Check Wallet</div>}
          {setReceiverIsSuccess && (
            <div>Transaction: {JSON.stringify(setReceiverData)}</div>
          )}
        </div>
        {/* Set sender */}
        <div>
          <input
            type="text"
            placeholder="sedner"
            className="border-2 border-gray-500"
            onChange={(e) => setSender(e.target.value)}
          />
          <button disabled={!writeSetSender} onClick={() => writeSetSender?.()}>
            Set Sender
          </button>
          {setSenderIsLoading && <div>Check Wallet</div>}
          {setSenderIsSuccess && (
            <div>Transaction: {JSON.stringify(setSenderData)}</div>
          )}
        </div>
        <div>
          <input
            type="text"
            placeholder="receiver"
            className="border-2 border-gray-500"
            onChange={(e) => setReceiver(e.target.value)}
          />
          <input
            type="text"
            placeholder="value"
            className="border-2 border-gray-500"
            onChange={(e) => setValue(e.target.value)}
          />
          <button disabled={!writeSend} onClick={() => writeSend?.()}>
            Send Ether
          </button>
          {sendIsLoading && <div>Check Wallet</div>}
          {sendIsSuccess && <div>Transaction: {JSON.stringify(sendData)}</div>}
          {(isSendPrepareError || sendIsError) && (
            <div>Error: {(sendPrepareError || sendError)?.message}</div>
          )}
        </div>
      </div>
    </main>
  );
}
