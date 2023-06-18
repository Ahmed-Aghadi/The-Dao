import { AppContainer } from "@/components/AppContainer";
import { dataDaoAbi, rpcUrl } from "@/constants";
import { Skeleton, Tabs } from "@mantine/core";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import {
  Badge,
  Center,
  Container,
  createStyles,
  Group,
  Text,
  Title,
} from "@mantine/core";
import {
  IconBoxMultiple0,
  IconCirclePlus,
  IconEdit,
  IconMessage,
} from "@tabler/icons";
import { CreateProposal } from "@/components/CreateProposal";
import { Proposal } from "@/components/Proposal";
import { ProposalRole } from "@/components/ProposalRole";
import { VoterRole } from "@/components/VoterRole";
import { Chat } from "@/components/Chat";

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: 34,
    fontWeight: 900,
    [theme.fn.smallerThan("sm")]: {
      fontSize: 24,
    },
  },

  description: {
    maxWidth: 600,
    margin: "auto",

    "&::after": {
      content: '""',
      display: "block",
      backgroundColor: theme.fn.primaryColor(),
      width: 45,
      height: 2,
      marginTop: theme.spacing.sm,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },

  card: {
    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
  },

  cardTitle: {
    "&::after": {
      content: '""',
      display: "block",
      backgroundColor: theme.fn.primaryColor(),
      width: 45,
      height: 2,
      marginTop: theme.spacing.sm,
    },
  },
}));

export default function Home() {
  const { classes, theme } = useStyles();
  const [activeTab, setActiveTab] = useState<string | null>("first");
  const [daoName, setDaoName] = useState<string>("");
  const [minVotes, setMinVotes] = useState<string>("");
  const [proposalCount, setProposalCount] = useState<string>("");
  const [isProposer, setIsProposer] = useState<boolean>(false);
  const [isVoter, setIsVoter] = useState<boolean>(false);
  const { address, isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (!router.query.address) return;
      const contractInstance = new ethers.Contract(
        router.query.address as string,
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
  }, [router.query]);
  return (
    <AppContainer>
      <Skeleton
        style={{ width: "100%", height: "100%" }}
        visible={router.query.address === undefined}
      >
        <div
          style={{
            backgroundColor: "rgb(20, 20, 20)",
            height: "100%",
            width: "100%",
          }}
        >
          <Container size="lg" py="xl">
            <Group position="center">
              <Badge variant="filled" size="lg">
                DAO
              </Badge>
            </Group>

            {daoName === "" && <Skeleton mt="sm" height={50} />}
            {daoName !== "" && (
              <Title order={2} className={classes.title} align="center" mt="sm">
                {daoName}
              </Title>
            )}

            {minVotes === "" && <Skeleton mt="md" height={35} />}
            {minVotes !== "" && (
              <Center mt="md">
                <Badge variant="outline" size="lg">
                  {minVotes} {minVotes === "1" ? "Vote" : "Votes"} Required to
                  Pass a Proposal
                </Badge>
              </Center>
            )}

            {proposalCount === "" && <Skeleton mt="md" height={35} />}

            {proposalCount !== "" && (
              <Center mt="md">
                <Badge variant="outline" size="lg">
                  {proposalCount} Proposals
                </Badge>
              </Center>
            )}

            <Text
              color="dimmed"
              className={classes.description}
              align="center"
              mt="md"
            >
              Create proposals, vote on proposals, and more.
            </Text>
            <Tabs value={activeTab} onTabChange={setActiveTab} mt="md">
              <Tabs.List mb="md" grow>
                <Tabs.Tab value="first" icon={<IconCirclePlus />}>
                  Create Proposal
                </Tabs.Tab>
                <Tabs.Tab value="second" icon={<IconBoxMultiple0 />}>
                  Proposals
                </Tabs.Tab>
                <Tabs.Tab value="third" icon={<IconEdit />}>
                  Update Proposal Roles
                </Tabs.Tab>
                <Tabs.Tab value="fourth" icon={<IconEdit />}>
                  Update Voter Roles
                </Tabs.Tab>
                <Tabs.Tab value="fifth" icon={<IconMessage />}>
                  Chat
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="first">
                <CreateProposal />
              </Tabs.Panel>
              <Tabs.Panel value="second">
                <Proposal />
              </Tabs.Panel>
              <Tabs.Panel value="third">
                <ProposalRole />
              </Tabs.Panel>
              <Tabs.Panel value="fourth">
                <VoterRole minVotes={minVotes} />
              </Tabs.Panel>
              <Tabs.Panel value="fifth">
                <Chat />
              </Tabs.Panel>
            </Tabs>
          </Container>
        </div>
      </Skeleton>
    </AppContainer>
  );
}
