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

type Deal = {
    value: string;
    label: string;
};
export function CreateProposal() {
    const { classes, theme, cx } = useStyles();
    const { data: signer } = useSigner();
    const { isConnected } = useAccount();
    const router = useRouter();
    const [deals, setDeals] = useState<Deal[]>([]);
    useEffect(() => {
        setDeals([]);
        for (const deal of Object.keys(marketDeals)) {
            setDeals((prev) => [
                ...prev,
                {
                    value: deal,
                    label: marketDeals[deal as keyof typeof marketDeals]
                        .Proposal.PieceCID["/"],
                },
            ]);
        }
    }, []);
    const form = useForm({
        initialValues: {
            cid: "",
            bountyAmount: "0",
            numberOfBounties: 0,
            minDays: 0,
            maxDealAtATime: 0,
            minDealsDone: 0,
            endDate: new Date(),
            endTime: new Date(),
        },

        // functions will be used to validate values at corresponding key
        validate: {
            cid: (value) => (value.length === 0 ? "Select a CID" : null),
            bountyAmount: (value) =>
                /^\d*\.?\d*$/.test(value)
                    ? parseFloat(value) <= 0
                        ? "Bounty Amount must be greater than 0"
                        : null
                    : "Bounty Amount must be a number",
            numberOfBounties: (value) =>
                value <= 0 ? "Number Of Bounties must be greater than 0" : null,
            minDays: (value) =>
                value < 0 ? "Min Days can't be less than 0" : null,
            maxDealAtATime: (value) =>
                value < 0 ? "Max Deal At A Time can't be less than 0" : null,
            minDealsDone: (value) =>
                value < 0 ? "Min Deals Done can't be less than 0" : null,
            // endDate: (value) =>
            //     value.endDay.getDate() === value.endTime.getDate() &&
            //     value.endDay.getMonth() === value.endTime.getMonth() &&
            //     value.endDay.getFullYear() === value.endTime.getFullYear() &&
            //     value.endTime.getTime() < new Date().getTime()
            //         ? "End Date must be greater than today"
            //         : null,
            endDate: (value) =>
                value.getDate() < new Date().getDate() &&
                value.getMonth() <= new Date().getMonth() &&
                value.getFullYear() <= new Date().getFullYear()
                    ? "End Date must be greater than today"
                    : null,
            endTime: (value, values) =>
                values.endDate.getDate() === value.getDate() &&
                values.endDate.getMonth() === value.getMonth() &&
                values.endDate.getFullYear() === value.getFullYear() &&
                value.getTime() < new Date().getTime()
                    ? "End Time must be greater than today's time and date"
                    : null,
        },
    });
    return (
        <div
            style={{
                height: "100%",
            }}
        >
            <form
                onSubmit={form.onSubmit(async (values) => {
                    console.log(values);
                    if (!isConnected) {
                        showNotification({
                            id: "hello-there",
                            autoClose: 5000,
                            title: "Connect Wallet",
                            message:
                                "Please connect your wallet to create a proposal",
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
                        title: "Creating Dao...",
                        message: "Please wait while we create your Proposal",
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
                        // address[] memory proposers,
                        // address[] memory voters,
                        // uint minVotesArg,
                        // string memory name
                        const endDateTime = new Date(values.endDate);
                        endDateTime.setHours(values.endTime.getHours());
                        endDateTime.setMinutes(values.endTime.getMinutes());
                        endDateTime.setSeconds(values.endTime.getSeconds());
                        console.log(endDateTime);

                        const cidHexRaw = new CID(
                            marketDeals[
                                values.cid as keyof typeof marketDeals
                            ].Proposal.PieceCID["/"]
                        )
                            .toString("base16")
                            .substring(1);
                        const cidHex = "0x00" + cidHexRaw;

                        console.log({
                            cidHex,
                            PieceSize:
                                marketDeals[
                                    values.cid as keyof typeof marketDeals
                                ].Proposal.PieceSize,
                            bountyAmount: ethers.utils.parseEther(
                                values.bountyAmount.toString()
                            ),
                            numberOfBounties: values.numberOfBounties,
                            minDays: values.minDays * 24 * 60 * 2,
                            maxDealAtATime: values.maxDealAtATime,
                            minDealsDone: values.minDealsDone,
                            endDateTime: (endDateTime.getTime() / 1000).toFixed(
                                0
                            ),
                        });

                        const tx = await contractInstance.createProposol(
                            cidHex,
                            marketDeals[values.cid as keyof typeof marketDeals]
                                .Proposal.PieceSize,
                            ethers.utils.parseEther(
                                values.bountyAmount.toString()
                            ),
                            values.numberOfBounties,
                            values.minDays * 24 * 60 * 2, // every block is mined in 30 seconds
                            values.maxDealAtATime,
                            values.minDealsDone,
                            (endDateTime.getTime() / 1000).toFixed(0)
                        );

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
                            title: "Proposal Created",
                            message: "Your Proposal has been created",
                            icon: <IconCheck size={16} />,
                            autoClose: 2000,
                        });
                        router.reload();
                    } catch (error) {
                        console.log(error);
                        updateNotification({
                            id: "load-data",
                            color: "red",
                            title: "Unable to create Proposal",
                            message: "Check console for more details",
                            icon: <IconX size={16} />,
                            autoClose: 2000,
                        });
                    }
                })}
            >
                {/* <TextInput
                    label="Cid"
                    placeholder="Name"
                    {...form.getInputProps("name")}
                /> */}
                <Select
                    label="Cid"
                    placeholder="Select cid"
                    data={deals}
                    searchable
                    rightSection={
                        <Tooltip
                            label="Select the cid you want to create a proposal for"
                            color="blue"
                            position="top-end"
                            withArrow
                        >
                            <div>
                                <IconQuestionCircle
                                    size={30}
                                    style={{ display: "block" }}
                                    className={classes.tooltipIcon}
                                />
                            </div>
                        </Tooltip>
                    }
                    {...form.getInputProps("cid")}
                />
                <TextInput
                    mt="sm"
                    type="number"
                    step="0.00000000000000001"
                    label="Bounty Amount ( in FIL )"
                    placeholder="Bounty Amount ( in FIL )"
                    rightSection={
                        <Tooltip
                            label="The amount of FIL you want to offer for a storage provider to store the data as a bounty"
                            color="blue"
                            position="top-end"
                            withArrow
                        >
                            <div>
                                <IconQuestionCircle
                                    size={30}
                                    style={{
                                        display: "block",
                                        marginRight: theme.spacing.xs,
                                    }}
                                    className={classes.tooltipIcon}
                                />
                            </div>
                        </Tooltip>
                    }
                    {...form.getInputProps("bountyAmount")}
                />
                <NumberInput
                    mt="sm"
                    label="Number Of Bounties"
                    placeholder="Number Of Bounties"
                    min={0}
                    rightSection={
                        <Tooltip
                            label="The number of bounties you want to offer for the storage providers to store the data"
                            color="blue"
                            position="top-end"
                            withArrow
                        >
                            <div>
                                <IconQuestionCircle
                                    size={30}
                                    style={{
                                        display: "block",
                                        marginRight: theme.spacing.xs,
                                    }}
                                    className={classes.tooltipIcon}
                                />
                            </div>
                        </Tooltip>
                    }
                    {...form.getInputProps("numberOfBounties")}
                />
                <NumberInput
                    mt="sm"
                    label="Min Days"
                    placeholder="Min Days"
                    min={0}
                    rightSection={
                        <Tooltip
                            label="Minimum number of days the storage provider should have store the data before claiming the bounty"
                            color="blue"
                            position="top-end"
                            withArrow
                        >
                            <div>
                                <IconQuestionCircle
                                    size={30}
                                    style={{
                                        display: "block",
                                        marginRight: theme.spacing.xs,
                                    }}
                                    className={classes.tooltipIcon}
                                />
                            </div>
                        </Tooltip>
                    }
                    {...form.getInputProps("minDays")}
                />
                <NumberInput
                    mt="sm"
                    label="Max Deal At A Time"
                    placeholder="Max Deal At A Time"
                    min={0}
                    rightSection={
                        <Tooltip
                            label="Maximum number of bounty deals at a time ( enter 0 for no limit )"
                            color="blue"
                            position="top-end"
                            withArrow
                        >
                            <div>
                                <IconQuestionCircle
                                    size={30}
                                    style={{
                                        display: "block",
                                        marginRight: theme.spacing.xs,
                                    }}
                                    className={classes.tooltipIcon}
                                />
                            </div>
                        </Tooltip>
                    }
                    {...form.getInputProps("maxDealAtATime")}
                />
                <NumberInput
                    mt="sm"
                    label="Min Deals Done"
                    placeholder="Min Deals Done"
                    min={0}
                    rightSection={
                        <Tooltip
                            label="Minimum number of bounty deals the storage provider should have done before claiming the bounty in The DAO"
                            color="blue"
                            position="top-end"
                            withArrow
                        >
                            <div>
                                <IconQuestionCircle
                                    size={30}
                                    style={{
                                        display: "block",
                                        marginRight: theme.spacing.xs,
                                    }}
                                    className={classes.tooltipIcon}
                                />
                            </div>
                        </Tooltip>
                    }
                    {...form.getInputProps("minDealsDone")}
                />
                <DatePicker
                    label="End Date"
                    excludeDate={(date) =>
                        date.getDate() < new Date().getDate() &&
                        date.getMonth() <= new Date().getMonth() &&
                        date.getFullYear() <= new Date().getFullYear()
                    }
                    rightSection={
                        <Tooltip
                            label="The date when the proposal will expire"
                            color="blue"
                            position="top-end"
                            withArrow
                        >
                            <div>
                                <IconQuestionCircle
                                    size={30}
                                    style={{
                                        display: "block",
                                        marginRight: theme.spacing.xs,
                                    }}
                                    className={classes.tooltipIcon}
                                />
                            </div>
                        </Tooltip>
                    }
                    {...form.getInputProps("endDate")}
                />
                <TimeInput
                    label="End Time"
                    withSeconds
                    rightSection={
                        <Tooltip
                            label="The time when the proposal will expire"
                            color="blue"
                            position="top-end"
                            withArrow
                        >
                            <div>
                                <IconQuestionCircle
                                    size={30}
                                    style={{
                                        display: "block",
                                        marginRight: theme.spacing.xs,
                                    }}
                                    className={classes.tooltipIcon}
                                />
                            </div>
                        </Tooltip>
                    }
                    {...form.getInputProps("endTime")}
                />
                <Button type="submit" mt="sm">
                    Submit
                </Button>
            </form>
        </div>
    );
}
