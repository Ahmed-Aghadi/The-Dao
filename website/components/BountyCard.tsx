import { dataDaoAbi, marketDeals } from "@/constants";
import {
  Button,
  Card,
  createStyles,
  Flex,
  RingProgress,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAccount, useSigner } from "wagmi";

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
    lineHeight: 1,
  },

  inner: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
    alignItems: "center",
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

type BountyCardArg = {
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
  enabled: number;
  minVotes: number;
  contractAddress: string;
};

type Deal = {
  value: string;
  label: string;
};
export function BountyCard({
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
  contractAddress,
}: BountyCardArg) {
  const { classes, theme, cx } = useStyles();
  const { data: signer } = useSigner();
  const { isConnected } = useAccount();
  const router = useRouter();

  const [value, setValue] = useState<string | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  useEffect(() => {
    setDeals([]);
    for (const deal of Object.keys(marketDeals)) {
      if (
        marketDeals[deal as keyof typeof marketDeals].Proposal.PieceCID["/"] ===
        cid
      ) {
        setDeals((prev) => [
          ...prev,
          {
            value: deal,
            label: `Deal ID: ${deal}`,
          },
        ]);
      }
    }
  }, []);
  async function handleClaimBounty() {
    if (!isConnected) {
      showNotification({
        id: "hello-there",
        autoClose: 5000,
        title: "Connect Wallet",
        message: "Please connect your wallet to claim bounty",
        color: "red",
        icon: <IconX />,
        className: "my-notification-class",
        loading: false,
      });
      return;
    }
    if (!value) {
      showNotification({
        id: "hello-there",
        autoClose: 5000,
        title: "Select a deal",
        message: "Please select a deal to claim bounty",
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
      title: "Claiming bounty...",
      message: "Please wait...",
      autoClose: false,
      disallowClose: true,
    });

    try {
      const address = contractAddress;
      const contractInstance = new ethers.Contract(
        address,
        dataDaoAbi,
        signer!
      );
      const tx = await contractInstance.claimBounty(value!);

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
        title: "Done!",
        message: "Bounty claimed",
        icon: <IconCheck size={16} />,
        autoClose: 2000,
      });
      router.reload();
    } catch (error) {
      console.log(error);
      updateNotification({
        id: "load-data",
        color: "red",
        title: "Unable to claim bounty",
        message: "Check console for more details",
        icon: <IconX size={16} />,
        autoClose: 2000,
      });
    }
  }

  return (
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
              <Text className={classes.label}>{bountyAmount}</Text>
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
              <Text className={classes.label}>{numberOfBounties}</Text>
              <Text size="xs" color="dimmed">
                Number of Bounties
              </Text>
            </div>
            <div>
              <Text className={classes.label}>
                {maxDealAtATime === 0 ? "Unlimited" : maxDealAtATime}
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
              <Text className={classes.label}>{minDealsDone}</Text>
              <Text size="xs" color="dimmed">
                Min Deals done in The DAO
              </Text>
            </div>
          </Flex>
        </div>

        <div className={classes.ring}>
          <RingProgress
            roundCaps
            thickness={6}
            size={150}
            sections={[
              {
                value:
                  (parseFloat(amountedFunded) / parseFloat(bountyAmount)) *
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
                      (parseFloat(bountyAmount) * numberOfBounties)) *
                    100
                  ).toFixed(0)}
                  %
                </Text>
                <Text align="center" size="xs" color="dimmed">
                  Bounty Funded
                </Text>
              </div>
            }
          />
        </div>
        {deals.length == 0 ? (
          <TextInput
            label="Your Deal ID"
            placeholder="Enter Deal ID"
            type="number"
            value={value || ""}
            onChange={(e) => setValue(e.currentTarget.value)}
          />
        ) : (
          <Select
            label="Your Deal ID"
            placeholder="Select Deal ID"
            searchable
            nothingFound="No options"
            value={value}
            onChange={setValue}
            data={deals}
          />
        )}
        <Button
          mt="md"
          variant="outline"
          disabled={value === null || amountedFunded == "0.0"}
          size="md"
          onClick={() => {
            handleClaimBounty();
          }}
        >
          {value === null
            ? "Select Deal ID"
            : amountedFunded == "0.0"
            ? "No Bounty Left"
            : "Claim Bounty"}
        </Button>
      </div>
    </Card>
  );
}
