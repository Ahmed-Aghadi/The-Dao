import { dataDaoAbi, rpcUrl } from "@/constants";
import { Center, createStyles, Skeleton, Stack, Text } from "@mantine/core";
import { Icon3dCubeSphere } from "@tabler/icons";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },

  label: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 700,
    lineHeight: 1,
  },

  lead: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 700,
    fontSize: 22,
    lineHeight: 1,
  },

  inner: {
    display: "flex",

    [theme.fn.smallerThan(350)]: {
      flexDirection: "column",
    },
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

export function DaoCard({ daoAddress }: { daoAddress: string }) {
  const { classes, theme } = useStyles();
  const [daoName, setDaoName] = useState<string>("");
  const [minVotes, setMinVotes] = useState<string>("");
  const [proposalCount, setProposalCount] = useState<string>("");
  const [isProposer, setIsProposer] = useState<boolean>(false);
  const [isVoter, setIsVoter] = useState<boolean>(false);
  const { address, isConnected } = useAccount();
  useEffect(() => {
    (async () => {
      const contractInstance = new ethers.Contract(
        daoAddress,
        dataDaoAbi,
        ethers.getDefaultProvider(rpcUrl)
      );
      contractInstance.name().then((data: string) => {
        setDaoName(data);
      });
      contractInstance.minVotes().then((data: string) => {
        setMinVotes(data.toString());
      });
      contractInstance.proposalCount().then((data: string) => {
        setProposalCount(data.toString());
      });
      if (isConnected && address) {
        contractInstance.isProposer(address).then((data: boolean) => {
          setIsProposer(data);
        });
        contractInstance.isVoter(address).then((data: boolean) => {
          setIsVoter(data);
        });
      }
    })();
  }, [isConnected, address]);
  return (
    <div
      style={{
        height: "100%",
      }}
    >
      <Stack
        align="center"
        justify="space-around"
        spacing="xs"
        style={{
          height: "100%",
        }}
      >
        <Icon3dCubeSphere size={100} />
        <Skeleton height={16} visible={daoName === ""}>
          <Center>
            <Text size="xl" className={classes.label}>
              {daoName}
            </Text>
          </Center>
        </Skeleton>

        <Skeleton height={16} visible={daoName === ""}>
          <Center>
            <Text size="md">
              Minimum {minVotes === "1" ? "Vote" : "Votes"}: {minVotes}
            </Text>
          </Center>
        </Skeleton>

        <Skeleton height={16} visible={daoName === ""}>
          <Center>
            <Text size="md">{proposalCount} Proposals</Text>
          </Center>
        </Skeleton>
      </Stack>
    </div>
  );
}
