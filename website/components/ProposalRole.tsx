import { dataDaoAbi } from "@/constants";
import { Button, TextInput } from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAccount, useSigner } from "wagmi";

export function ProposalRole() {
  const { data: signer } = useSigner();
  const { isConnected } = useAccount();
  const router = useRouter();

  const [address, setAddress] = useState("");

  async function add() {
    if (!isConnected) {
      showNotification({
        id: "hello-there",
        autoClose: 5000,
        title: "Connect Wallet",
        message: "Please connect your wallet to add proposal role",
        color: "red",
        icon: <IconX />,
        className: "my-notification-class",
        loading: false,
      });
      return;
    }
    if (!address) {
      showNotification({
        id: "hello-there",
        autoClose: 5000,
        title: "Address",
        message: "Please enter the address",
        color: "red",
        icon: <IconX />,
        className: "my-notification-class",
        loading: false,
      });
      return;
    }
    showNotification({
      id: "load-data",
      loading: true,
      title: "Adding Proposal Role",
      message: "Please wait...",
      autoClose: false,
      disallowClose: true,
    });

    try {
      const address = router.query.address as string;
      const contractInstance = new ethers.Contract(
        address,
        dataDaoAbi,
        signer!
      );

      const tx = await contractInstance.addProposer(address);

      console.log("tx done");

      console.log("tx hash");
      console.log(tx.hash);
      console.log("-----------------------------");

      const response = await tx.wait();
      console.log("DONE!!!!!!!!!!!!!!!!!!");

      console.log("response");
      console.log(response);
      console.log("-----------------------------");

      updateNotification({
        id: "load-data",
        color: "teal",
        title: "Proposal Role Added!",
        message: "Proposal role added successfully",
        icon: <IconCheck size={16} />,
        autoClose: 2000,
      });
      router.reload();
    } catch (error) {
      console.log(error);
      updateNotification({
        id: "load-data",
        color: "red",
        title: "Unable to add Proposal Role!",
        message: "Check console for more details",
        icon: <IconX size={16} />,
        autoClose: 2000,
      });
    }
  }

  async function remove() {
    if (!isConnected) {
      showNotification({
        id: "hello-there",
        autoClose: 5000,
        title: "Connect Wallet",
        message: "Please connect your wallet to remove proposal role",
        color: "red",
        icon: <IconX />,
        className: "my-notification-class",
        loading: false,
      });
      return;
    }
    if (!address) {
      showNotification({
        id: "hello-there",
        autoClose: 5000,
        title: "Address",
        message: "Please enter the address",
        color: "red",
        icon: <IconX />,
        className: "my-notification-class",
        loading: false,
      });
      return;
    }
    showNotification({
      id: "load-data",
      loading: true,
      title: "Removing Proposal Role",
      message: "Please wait...",
      autoClose: false,
      disallowClose: true,
    });

    try {
      const address = router.query.address as string;
      const contractInstance = new ethers.Contract(
        address,
        dataDaoAbi,
        signer!
      );

      const tx = await contractInstance.removeProposer(address);

      console.log("tx done");

      console.log("tx hash");
      console.log(tx.hash);
      console.log("-----------------------------");

      const response = await tx.wait();
      console.log("DONE!!!!!!!!!!!!!!!!!!");

      console.log("response");
      console.log(response);
      console.log("-----------------------------");

      updateNotification({
        id: "load-data",
        color: "teal",
        title: "Proposal Role Removed!",
        message: "Proposal role removed successfully",
        icon: <IconCheck size={16} />,
        autoClose: 2000,
      });
      router.reload();
    } catch (error) {
      console.log(error);
      updateNotification({
        id: "load-data",
        color: "red",
        title: "Unable to remove Proposal Role!",
        message: "Check console for more details",
        icon: <IconX size={16} />,
        autoClose: 2000,
      });
    }
  }

  return (
    <div
      style={{
        height: "100%",
      }}
    >
      <TextInput
        label="Proposal Address"
        placeholder="0x..."
        required
        value={address}
        onChange={(event) => setAddress(event.currentTarget.value)}
      />
      <Button m="md" ml={0} onClick={add}>
        Add
      </Button>
      <Button m="md" color="red" onClick={remove}>
        Remove
      </Button>
    </div>
  );
}
