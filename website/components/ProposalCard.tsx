import {
    daoFactoryAbi,
    daoFactoryContractAddress,
    dataDaoAbi,
    marketDeals,
    rpcUrl,
} from "@/constants";
import {
    Button,
    Card,
    Center,
    createStyles,
    Flex,
    Group,
    NumberInput,
    RingProgress,
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
import { BountyCard } from "./BountyCard";

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: "inherit",
    },

    label: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontWeight: 700,
        lineHeight: 1,
        overflowWrap: "anywhere",
    },

    lead: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontWeight: 700,
        // fontSize: 22,
        lineHeight: 1,
    },

    inner: {
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "column",
        // justifyContent: "space-between",
        alignItems: "center",
        // [theme.fn.smallerThan(350)]: {
        //     flexDirection: "column",
        // },
    },

    ring: {
        flex: 1,
        display: "flex",
        justifyContent: "flex-end",

        [theme.fn.smallerThan(350)]: {
            justifyContent: "center",
            marginTop: theme.spacing.md,
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

type ProposalArg = {
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
    minVotes: number;
};

export function ProposalCard({
    id,
    cid,
    size,
    bountyAmount,
    numberOfBounties,
    amountedFunded,
    votes,
    minDays,
    maxDealAtATime,
    minDealsDone,
    endTime,
    enabled,
    minVotes,
}: ProposalArg) {
    const { classes, theme, cx } = useStyles();
    const { data: signer } = useSigner();
    const { isConnected } = useAccount();
    const router = useRouter();
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
        (async () => {
            const address = router.query.address as string;
            if (!address || !isConnected) return;
            const contractInstance = new ethers.Contract(
                address,
                dataDaoAbi,
                signer!
            );
            setHasVoted(
                await contractInstance.hasVoted(await signer?.getAddress(), id)
            );
        })();
    }, [router.query, isConnected]);

    async function handleVote() {
        if (!isConnected) {
            showNotification({
                id: "hello-there",
                autoClose: 5000,
                title: "Connect Wallet",
                message: "Please connect your wallet to vote",
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
            title: "Voting...",
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

            const tx = await contractInstance.vote(id.toString());

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
                title: "Done!",
                message: "Vote registered",
                icon: <IconCheck size={16} />,
                autoClose: 2000,
            });
            router.reload();
        } catch (error) {
            console.log(error);
            updateNotification({
                id: "load-data",
                color: "red",
                title: "Unable to vote",
                message: "Check console for more details",
                icon: <IconX size={16} />,
                autoClose: 2000,
            });
        }
    }

    async function handleFund() {
        if (!isConnected) {
            showNotification({
                id: "hello-there",
                autoClose: 5000,
                title: "Connect Wallet",
                message: "Please connect your wallet to fund",
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
            title: "Funding...",
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

            console.log(
                "bountyAmount",
                ethers.utils.parseEther(bountyAmount.toString())
            );
            console.log("contract", contractInstance);
            const tx = await contractInstance.fund(id.toString(), {
                value: ethers.utils.parseEther(bountyAmount.toString()),
                // gasLimit: 1000000,
            });

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
                title: "Done!",
                message: "Funding registered",
                icon: <IconCheck size={16} />,
                autoClose: 2000,
            });
            router.reload();
        } catch (error) {
            console.log(error);
            updateNotification({
                id: "load-data",
                color: "red",
                title: "Unable to fund",
                message: "Check console for more details",
                icon: <IconX size={16} />,
                autoClose: 2000,
            });
        }
    }

    return enabled ? (
        <BountyCard
            id={id}
            cid={cid}
            size={size}
            bountyAmount={bountyAmount}
            numberOfBounties={numberOfBounties}
            amountedFunded={amountedFunded}
            votes={votes}
            minDays={minDays}
            maxDealAtATime={maxDealAtATime}
            minDealsDone={minDealsDone}
            endTime={endTime}
            enabled={enabled}
            minVotes={minVotes}
            contractAddress={router.query.address as string}
        />
    ) : (
        <Card withBorder radius="md" className={classes.card}>
            <div className={classes.inner}>
                <div>
                    <Text size="lg" className={classes.label}>
                        {cid}
                    </Text>
                    <div>
                        <Text className={classes.lead} mt="lg">
                            {endTime.toLocaleString()}
                        </Text>
                        <Text size="xs" color="dimmed">
                            Proposal End Time
                        </Text>
                    </div>
                    <Flex
                        justify="space-between"
                        align="center"
                        mt="lg"
                        gap="md"
                        wrap="wrap"
                    >
                        <div>
                            <Text className={classes.label}>
                                {bountyAmount}
                            </Text>
                            <Text size="xs" color="dimmed">
                                Bounty Amount
                            </Text>
                        </div>
                        <div>
                            <Text className={classes.label}>{size}</Text>
                            <Text size="xs" color="dimmed">
                                Size
                            </Text>
                        </div>
                        <div>
                            <Text className={classes.label}>
                                {numberOfBounties}
                            </Text>
                            <Text size="xs" color="dimmed">
                                Number of Bounties
                            </Text>
                        </div>
                        <div>
                            <Text className={classes.label}>
                                {maxDealAtATime === 0
                                    ? "Unlimited"
                                    : maxDealAtATime}
                            </Text>
                            <Text size="xs" color="dimmed">
                                Max Deals at a Time
                            </Text>
                        </div>
                        <div>
                            <Text className={classes.label}>{minDays}</Text>
                            <Text size="xs" color="dimmed">
                                Min Days to Store
                            </Text>
                        </div>
                        <div>
                            <Text className={classes.label}>
                                {minDealsDone}
                            </Text>
                            <Text size="xs" color="dimmed">
                                Min Deals done in The DAO
                            </Text>
                        </div>
                    </Flex>
                </div>

                <div className={classes.ring}>
                    {endTime.getTime() > new Date().getTime() ? (
                        <RingProgress
                            roundCaps
                            thickness={6}
                            size={150}
                            sections={[
                                {
                                    value: (votes / minVotes) * 100,
                                    color: theme.primaryColor,
                                },
                            ]}
                            label={
                                <div>
                                    <Text
                                        align="center"
                                        size="lg"
                                        className={classes.label}
                                        sx={{ fontSize: 22 }}
                                    >
                                        {((votes / minVotes) * 100).toFixed(0)}%
                                    </Text>
                                    <Text
                                        align="center"
                                        size="xs"
                                        color="dimmed"
                                    >
                                        Votes Completed
                                    </Text>
                                </div>
                            }
                        />
                    ) : (
                        <RingProgress
                            roundCaps
                            thickness={6}
                            size={150}
                            sections={[
                                {
                                    value:
                                        (parseFloat(amountedFunded) /
                                            parseFloat(bountyAmount)) *
                                        numberOfBounties *
                                        100,
                                    color: theme.primaryColor,
                                },
                            ]}
                            label={
                                <div>
                                    <Text
                                        align="center"
                                        size="lg"
                                        className={classes.label}
                                        sx={{ fontSize: 22 }}
                                    >
                                        {(
                                            (parseFloat(amountedFunded) /
                                                (parseFloat(bountyAmount) *
                                                    numberOfBounties)) *
                                            100
                                        ).toFixed(0)}
                                        %
                                    </Text>
                                    <Text
                                        align="center"
                                        size="xs"
                                        color="dimmed"
                                    >
                                        Bounty Funded
                                    </Text>
                                </div>
                            }
                        />
                    )}
                </div>
                <Button
                    mt="md"
                    variant="outline"
                    disabled={
                        endTime.getTime() > new Date().getTime()
                            ? votes >= minVotes || hasVoted
                            : votes < minVotes ||
                              parseFloat(amountedFunded) >=
                                  parseFloat(bountyAmount) * numberOfBounties
                    }
                    // radius="xl"
                    size="md"
                    onClick={() => {
                        endTime.getTime() > new Date().getTime()
                            ? handleVote()
                            : handleFund();
                    }}
                >
                    {endTime.getTime() > new Date().getTime()
                        ? votes >= minVotes
                            ? "Minimum Votes Done"
                            : hasVoted
                            ? "Already Voted"
                            : "Vote"
                        : votes < minVotes
                        ? "Minimum Votes Not Done"
                        : "Fund"}
                </Button>
            </div>
        </Card>
    );
}
