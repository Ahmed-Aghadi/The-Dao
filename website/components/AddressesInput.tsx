import { Button, Group, ScrollArea, Text, TextInput } from "@mantine/core";
import type { FormErrors } from "@mantine/form";
import { ethers } from "ethers";
import { useState } from "react";

type AddressesInputProps = {
    addresses: string[];
    addAddress: (address: string) => void;
    inputTitle: string;
    listTitle: string;
    inputProps: FormErrors;
};

export function AddressesInput({
    addresses,
    addAddress,
    inputTitle,
    listTitle,
    inputProps,
}: AddressesInputProps) {
    const [currentVoter, setCurrentVoter] = useState<string>("");
    const [voterInputTouched, setVoterInputTouched] = useState<boolean>(false);

    const voterInputCheck = (voter: string) => {
        if (voter.length === 0) return null;
        if (!ethers.utils.isAddress(voter)) return "Invalid address";
        if (addresses.includes(voter)) return "Voter already added";
        return null;
    };
    return (
        <>
            <TextInput
                label={inputTitle}
                placeholder={"Add " + inputTitle + " address"}
                withAsterisk
                error={voterInputTouched ? voterInputCheck(currentVoter) : null}
                onChange={(e) => {
                    setVoterInputTouched(true);
                    setCurrentVoter(e.target.value);
                }}
                value={currentVoter}
            />
            <Group position="center" mt="md">
                <Button
                    onClick={() => {
                        if (currentVoter.length === 0) {
                            return;
                        }
                        if (voterInputCheck(currentVoter) === null) {
                            if (addresses.includes(currentVoter)) return;
                            addAddress(currentVoter);
                            setCurrentVoter("");
                            setVoterInputTouched(false);
                        }
                    }}
                >
                    Add {inputTitle.toLowerCase()}
                </Button>
            </Group>

            <Text fw={700} size="md" style={{ marginBottom: 10 }} mt="md">
                {listTitle}
            </Text>
            <ScrollArea.Autosize
                maxHeight={150}
                // sx={{ maxWidth: 400 }}
                mx="auto"
            >
                <div>
                    {addresses &&
                        addresses.map((voter) => (
                            <Text
                                key={voter}
                                size="sm"
                                style={{ marginBottom: 10 }}
                            >
                                {voter}
                            </Text>
                        ))}
                </div>
            </ScrollArea.Autosize>
            {inputProps.error && (
                <Text color="red" size="sm">
                    {inputProps.error}
                </Text>
            )}
        </>
    );
}
