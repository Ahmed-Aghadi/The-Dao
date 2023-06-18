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
  enabled: number;
};

export function Proposal() {
  const { classes, theme, cx } = useStyles();
  const { data: signer } = useSigner();
  const { isConnected } = useAccount();
  const router = useRouter();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [minVotes, setMinVotes] = useState<number>(0);

  useEffect(() => {
    setProposals([]);
    (async () => {
      const address = router.query.address as string;
      if (!address) return;
      const contractInstance = new ethers.Contract(
        address,
        dataDaoAbi,
        signer ? signer : ethers.getDefaultProvider(rpcUrl)
      );
      setMinVotes((await contractInstance.minVotes()).toString());
      const proposalCount = (await contractInstance.proposalCount()).toString();
      setProposals([]);
      for (let i = 1; i <= proposalCount; i++) {
        const proposal = await contractInstance.proposals(i);
        setProposals((proposals) => [
          ...proposals,
          {
            id: proposal.id.toString(),
            cid:
              proposal.enabled.toString() == 1
                ? "0x0"
                : new CID("f" + proposal.cid.toString().substring(4)).toString(
                    "base32"
                  ),
            size: proposal.size.toString(),
            bountyAmount: ethers.utils.formatEther(
              proposal.bountyAmount.toString()
            ),
            numberOfBounties: proposal.numberOfBounties.toString(),
            amountedFunded: ethers.utils.formatEther(
              proposal.amountedFunded.toString()
            ),
            votes: proposal.votes.toString(),
            minDays: proposal.minDays.toString() / (2 * 60 * 24),
            maxDealAtATime: proposal.maxDealAtATime.toString(),
            minDealsDone: proposal.minDealsDone.toString(),
            endTime: new Date(proposal.endTime.toString() * 1000),
            enabled: proposal.enabled.toString(),
          },
        ]);
      }
    })();
  }, [router.query]);
  return (
    <div
      style={{
        height: "100%",
      }}
    >
      <Grid>
        {proposals.length > 0 &&
          proposals.map((proposal) => (
            <Grid.Col sm={6} md={4} lg={4} key={proposal.id}>
              <ProposalCard
                key={proposal.id}
                id={proposal.id}
                cid={proposal.cid}
                size={proposal.size}
                bountyAmount={proposal.bountyAmount}
                numberOfBounties={proposal.numberOfBounties}
                amountedFunded={proposal.amountedFunded}
                votes={proposal.votes}
                minDays={proposal.minDays}
                maxDealAtATime={proposal.maxDealAtATime}
                minDealsDone={proposal.minDealsDone}
                endTime={proposal.endTime}
                enabled={proposal.enabled}
                minVotes={minVotes}
              />
            </Grid.Col>
          ))}
      </Grid>
    </div>
  );
}
