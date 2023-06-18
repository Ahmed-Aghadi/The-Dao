import { dataDaoAbi } from "@/constants";
import { Button, NumberInput, TextInput } from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAccount, useSigner } from "wagmi";

export function VoterRole({ minVotes }: { minVotes: string }) {
  const { data: signer } = useSigner();
  const { isConnected } = useAccount();
  const router = useRouter();

  const [address, setAddress] = useState("");
  const [minimumVotes, setMinimumVotes] = useState<number | undefined>(
    parseInt(minVotes)
  );

  async function add() {
    if (!isConnected) {
      showNotification({
        id: "hello-there",
        autoClose: 5000,
        title: "Connect Wallet",
        message: "Please connect your wallet to add voter role",
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
      title: "Adding Voter Role",
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

      const tx = await contractInstance.addVoter(address);

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
        title: "Voter Role Added!",
        message: "Voter role added successfully",
        icon: <IconCheck size={16} />,
        autoClose: 2000,
      });
      router.reload();
    } catch (error) {
      console.log(error);
      updateNotification({
        id: "load-data",
        color: "red",
        title: "Unable to add Voter Role!",
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
        message: "Please connect your wallet to remove voter role",
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
      title: "Removing Voter Role",
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

      const tx = await contractInstance.removeVoter(address);

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
        title: "Voter Role Removed!",
        message: "Voter role removed successfully",
        icon: <IconCheck size={16} />,
        autoClose: 2000,
      });
      router.reload();
    } catch (error) {
      console.log(error);
      updateNotification({
        id: "load-data",
        color: "red",
        title: "Unable to remove Voter Role!",
        message: "Check console for more details",
        icon: <IconX size={16} />,
        autoClose: 2000,
      });
    }
  }

  async function updateMinVotes() {
    if (!isConnected) {
      showNotification({
        id: "hello-there",
        autoClose: 5000,
        title: "Connect Wallet",
        message: "Please connect your wallet to update minimum votes",
        color: "red",
        icon: <IconX />,
        className: "my-notification-class",
        loading: false,
      });
      return;
    }
    if (!minimumVotes) {
      showNotification({
        id: "hello-there",
        autoClose: 5000,
        title: "Minimum Votes",
        message: "Please enter the minimum votes",
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
      title: "Updating Minimum Votes",
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

      const tx = await contractInstance.updateMinVotes(minimumVotes);

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
        title: "Minimum Votes Updated!",
        message: "Minimum votes updated successfully",
        icon: <IconCheck size={16} />,
        autoClose: 2000,
      });
      router.reload();
    } catch (error) {
      console.log(error);
      updateNotification({
        id: "load-data",
        color: "red",
        title: "Unable to update minimum Votes!",
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
        label="Voter Address"
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

      <NumberInput
        label="Update Minimum Number of Votes"
        placeholder={minVotes}
        required
        value={minimumVotes}
        onChange={(val) => setMinimumVotes(val)}
      />
      <Button m="md" ml={0} onClick={updateMinVotes}>
        Update
      </Button>
    </div>
  );
}
