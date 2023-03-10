import {
    daoFactoryAbi,
    daoFactoryContractAddress,
    dataDaoAbi,
    marketDeals,
    rpcUrl,
} from "@/constants";
import {
    Button,
    Center,
    createStyles,
    Grid,
    NumberInput,
    Select,
    Skeleton,
    Stack,
    Text,
    TextInput,
    Tooltip,
} from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import {
    Icon3dCubeSphere,
    IconCheck,
    IconQuestionCircle,
    IconX,
} from "@tabler/icons";
import CID from "cids";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAccount, useSigner } from "wagmi";
import { ProposalCard } from "./ProposalCard";

const useStyles = createStyles((theme) => ({
    tooltipIcon: {
        display: "block",
        opacity: 0.5,
        "&:hover": {
            cursor: "pointer",
            opacity: 0.8,
        },
    },
}));

// struct Proposal {
//     uint id;
//     bytes cid;
//     uint size;
//     uint bountyAmount;
//     uint numberOfBounties;
//     uint amountedFunded;
//     uint votes;
//     uint64 minDays; // minimum number of days the storage provider should have stored the data ( in blocks )
//     uint64 maxDealAtATime; // maximum number of deals that can be made at a time ( 0 = unlimited )
//     uint minDealsDone; // minimum number of deals that provider has already done in all the Daos under the DaoFactory
//     uint endTime; // proposal end time
//     bool enabled; // true if the amount funded is equal to the bounty amount * number of bounties
// }

type Proposal = {
    id: number;
    cid: string;
    size: number;
    bountyAmount: string;
    numberOfBounties: number;
    amountedFunded: string;
    votes: number;
    minDays: number;
    maxDealAtATime: number;
    minDealsDone: number;
    endTime: Date;
    enabled: boolean;
};

export function ProposalRole() {
    const { classes, theme, cx } = useStyles();
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

            // console.log("response hash")
            // console.log(response.hash)
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

            // console.log("response hash")
            // console.log(response.hash)
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
                style={
                    {
                        // width: "100%",
                    }
                }
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
