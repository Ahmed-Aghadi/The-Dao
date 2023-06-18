import {
  daoFactoryAbi,
  daoFactoryContractAddress,
  dataDaoAbi,
  marketDeals,
  rpcUrl,
} from "@/constants";
import {
  Anchor,
  Button,
  Card,
  Center,
  Checkbox,
  createStyles,
  FileInput,
  Flex,
  Group,
  Modal,
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
import { Polybase } from "@polybase/client";

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
  tooltipIcon: {
    display: "block",
    opacity: 0.5,
    "&:hover": {
      cursor: "pointer",
      opacity: 0.8,
    },
  },
}));

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
  enabled: number;
  minVotes: number;
};

const db = new Polybase({
  defaultNamespace:
    "pk/0x2c57ac0fb26925e229569ad92eb06f540da113b565ee2943fb53029e44b2a60f0a3333bac53dcb89baf2f0b8fec75f175ceb1bb5bb658d9c24e89b27c06f606f/General_Use",
});

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

  const [url, setUrl] = useState("");

  const [cidString, setCidString] = useState("");
  const [sizeString, setSizeString] = useState<number | undefined>(0);
  const [uploadFile, setUploadFile] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const signData = async (data: string) => {
    const signature = await signer!.signMessage(data);
    console.log("signature", signature);
    return signature;
  };

  async function fetchUrl() {
    const proposalReference = db.collection("Proposal");
    console.log("proposalReference", proposalReference);
    const proposalRecord = await proposalReference
      .record(router.query.address + "-" + id.toString())
      .get();
    console.log("proposalRecord", proposalRecord);
    setUrl(proposalRecord.data.url);
  }

  useEffect(() => {
    (async () => {
      const address = router.query.address as string;
      if (!address || !isConnected) return;
      fetchUrl();
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
      });

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

  const enablePartialProposal = async () => {
    if (uploadFile) {
      if (!file) {
        showNotification({
          id: "hello-there",
          autoClose: 5000,
          title: "Upload File",
          message: "Please upload a file.",
          color: "red",
          icon: <IconX />,
          className: "my-notification-class",
          loading: false,
        });
        return;
      }
    } else {
      if (cidString.length === 0) {
        showNotification({
          id: "hello-there",
          autoClose: 5000,
          title: "CID",
          message: "Please enter a CID.",
          color: "red",
          icon: <IconX />,
          className: "my-notification-class",
          loading: false,
        });
        return;
      }

      if (!sizeString) {
        showNotification({
          id: "hello-there",
          autoClose: 5000,
          title: "Size",
          message: "Please enter a size.",
          color: "red",
          icon: <IconX />,
          className: "my-notification-class",
          loading: false,
        });
        return;
      }
    }
    if (!isConnected) {
      showNotification({
        id: "hello-there",
        autoClose: 5000,
        title: "Connect Wallet",
        message: "Please connect your wallet.",
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
      title: "Enabling...",
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

      let cidHex;
      let sizeOfFile = sizeString!;
      if (uploadFile) {
        const body = new FormData();
        body.append("file", file!);
        const res = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/api/upload-lighthouse",
          {
            method: "POST",
            body: body,
          }
        );
        console.log("res", res);
        const jsonRes = await res.json();
        console.log("jsonRes", jsonRes);
        sizeOfFile = jsonRes.size.toString();
        const cidV0 = jsonRes.result;
        const cidHexRaw = new CID(cidV0).toV1().toString("base16").substring(1);
        cidHex = "0x00" + cidHexRaw;
      } else {
        const cidHexRaw = new CID(cidString).toString("base16").substring(1);
        cidHex = "0x00" + cidHexRaw;
      }

      const tx = await contractInstance.enablePartial(
        id.toString(),
        cidHex,
        sizeOfFile.toString()
      );

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
        message: "Proposal enabled",
        icon: <IconCheck size={16} />,
        autoClose: 2000,
      });
      router.reload();
    } catch (error) {
      console.log(error);
      updateNotification({
        id: "load-data",
        color: "red",
        title: "Unable to enable",
        message: "Check console for more details",
        icon: <IconX size={16} />,
        autoClose: 2000,
      });
    }
  };

  return enabled == 3 ? (
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
          {enabled == 1 ? (
            <Anchor href={url} target="_blank">
              File Link
            </Anchor>
          ) : (
            <Text size="lg" className={classes.label}>
              {cid}
            </Text>
          )}
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
              <Text className={classes.label}>
                {enabled == 1 ? "N/A" : size}
              </Text>
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
                  <Text align="center" size="xs" color="dimmed">
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

        {enabled == 1 && (
          <Button
            mt="md"
            variant="outline"
            size="md"
            onClick={() => setIsModalOpen(true)}
          >
            Enable Partial Proposal
          </Button>
        )}
        <Modal
          opened={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Enable Partial Proposal"
        >
          <Checkbox
            label="Upload File"
            description="Upload file on filecoin and use it as data to enable proposal"
            mb="lg"
            checked={uploadFile}
            onChange={(event) => setUploadFile(event.currentTarget.checked)}
          />
          {uploadFile ? (
            <FileInput
              label="Upload files"
              placeholder="Upload files"
              value={file}
              onChange={setFile}
            />
          ) : (
            <>
              <TextInput
                mt="sm"
                label="Cid"
                placeholder="baga6ea4seaqhzv2fywhelzail4apq4xnlji6zty2ooespk2lnktolg5lse7qgii"
                rightSection={
                  <Tooltip
                    label="CID of the data you want to enable proposal for"
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
                value={cidString}
                onChange={(e) => setCidString(e.currentTarget.value)}
              />

              <NumberInput
                mt="sm"
                label="Size"
                placeholder="100"
                min={0}
                rightSection={
                  <Tooltip
                    label="Size of the data you want to enable proposal for"
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
                value={sizeString}
                onChange={(e) => setSizeString(e)}
              />
            </>
          )}
          <Button
            mt="md"
            variant="outline"
            size="md"
            onClick={() => enablePartialProposal()}
          >
            Enable Partial Proposal
          </Button>
        </Modal>
      </div>
    </Card>
  );
}
