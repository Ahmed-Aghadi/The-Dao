import { AddressesInput } from "@/components/AddressesInput";
import { AppContainer } from "@/components/AppContainer";
import {
    Badge,
    Box,
    Button,
    Container,
    createStyles,
    Group,
    NumberInput,
    ScrollArea,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import {
    hasLength,
    isEmail,
    isInRange,
    isNotEmpty,
    matches,
    useForm,
} from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import { ethers } from "ethers";
import { useState } from "react";
import { useAccount, useSigner } from "wagmi";
import { daoFactoryAbi, daoFactoryContractAddress } from "@/constants/index";
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
    title: {
        fontSize: 34,
        fontWeight: 900,
        [theme.fn.smallerThan("sm")]: {
            fontSize: 24,
        },
    },
}));

export default function Home() {
    const { classes, theme } = useStyles();
    const { data: signer } = useSigner();
    const { isConnected } = useAccount();
    const router = useRouter();
    const validateAddresses = (addresses: string[], listName: string) => {
        if (addresses.length === 0) return listName + " cannot be empty";
        const invalidAddresses = addresses.filter(
            (address) => !ethers.utils.isAddress(address)
        );
        return invalidAddresses.length === 0 ? null : "Invalid address";
    };
    const form = useForm({
        initialValues: {
            name: "",
            proposals: [],
            voters: [],
            minVotes: null,
        },

        validate: {
            name: hasLength(
                { min: 1 },
                "Name must be at least 1 character long"
            ),
            proposals: (proposals) => validateAddresses(proposals, "Proposals"),
            voters: (voter) => validateAddresses(voter, "Voters"),
            minVotes: isInRange({ min: 1 }, "Minimum votes must be at least 1"),
        },
    });

    const onSubmit = async () => {
        console.log(form.values);
        if (!isConnected) {
            showNotification({
                id: "hello-there",
                autoClose: 5000,
                title: "Connect Wallet",
                message: "Please connect your wallet to create DAO",
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
            message: "Please wait while we create your DAO",
            autoClose: false,
            disallowClose: true,
        });
        try {
            const contractInstance = new ethers.Contract(
                daoFactoryContractAddress,
                daoFactoryAbi,
                signer!
            );
            // address[] memory proposers,
            // address[] memory voters,
            // uint minVotesArg,
            // string memory name
            const tx = await contractInstance.createDao(
                form.values.proposals,
                form.values.voters,
                form.values.minVotes,
                form.values.name
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
                title: "Dao Created",
                message: "Your DAO has been created",
                icon: <IconCheck size={16} />,
                autoClose: 2000,
            });
            router.push("/daos");
        } catch (error) {
            console.log(error);
            updateNotification({
                id: "load-data",
                color: "red",
                title: "Unable to create DAO",
                message: "Check console for more details",
                icon: <IconX size={16} />,
                autoClose: 2000,
            });
        }
    };

    return (
        <AppContainer>
            <Container size="lg" py="xl">
                <Title
                    order={2}
                    className={classes.title}
                    align="center"
                    mt="sm"
                >
                    Create your DAO
                </Title>
            </Container>
            <Box
                component="form"
                maw={400}
                mx="auto"
                onSubmit={form.onSubmit(() => {
                    onSubmit();
                })}
            >
                <TextInput
                    label="Name"
                    placeholder="Name of DAO"
                    withAsterisk
                    {...form.getInputProps("name")}
                />
                <AddressesInput
                    addresses={form.values.proposals}
                    addAddress={(address) => {
                        form.setFieldValue("proposals", [
                            // @ts-ignore
                            ...form.values.proposals,
                            // @ts-ignore
                            address,
                        ]);
                        // form.insertListItem("voters", address);
                    }}
                    inputTitle="Proposal"
                    listTitle="Proposals List :"
                    inputProps={{ ...form.getInputProps("proposals") }}
                />
                <AddressesInput
                    addresses={form.values.voters}
                    addAddress={(address) => {
                        form.setFieldValue("voters", [
                            // @ts-ignore
                            ...form.values.voters,
                            // @ts-ignore
                            address,
                        ]);
                        // form.insertListItem("voters", address);
                    }}
                    inputTitle="Voter"
                    listTitle="Voters List :"
                    inputProps={{ ...form.getInputProps("voters") }}
                />
                <NumberInput
                    label="Minimum Votes"
                    placeholder="Minimum Votes to accept proposal"
                    withAsterisk
                    mt="md"
                    min={1}
                    {...form.getInputProps("minVotes")}
                />

                <Group position="right" mt="md">
                    <Button type="submit">Submit</Button>
                </Group>
            </Box>
        </AppContainer>
    );
}
