import { AppContainer } from "@/components/AppContainer";
import { BountyCard } from "@/components/BountyCard";
import {
  daoFactoryAbi,
  daoFactoryContractAddress,
  dataDaoAbi,
  rpcUrl,
} from "@/constants";
import { Grid } from "@mantine/core";
import CID from "cids";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSigner } from "wagmi";

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
  minVotes: number;
  contractAddress: string;
};

export default function Home() {
  const { data: signer } = useSigner();
  const router = useRouter();
  const [bounties, setBounties] = useState<Proposal[]>([]);
  console.log("bounties: ", bounties);

  useEffect(() => {
    (async () => {
      const contractInstanceDaoFactory = new ethers.Contract(
        daoFactoryContractAddress,
        daoFactoryAbi,
        ethers.getDefaultProvider(rpcUrl)
      );
      const daos = await contractInstanceDaoFactory.getDeployedDaos();

      setBounties([]);
      for (let i = 0; i < daos.length; i++) {
        const contractInstance = new ethers.Contract(
          daos[i],
          dataDaoAbi,
          signer ? signer : ethers.getDefaultProvider(rpcUrl)
        );
        const minVotes = (await contractInstance.minVotes()).toString();
        const proposalCount = (
          await contractInstance.proposalCount()
        ).toString();
        for (let j = 1; j <= proposalCount; j++) {
          const proposal = await contractInstance.proposals(j);
          if (proposal.enabled.toString() != "3") {
            continue;
          }
          setBounties((proposals) => [
            ...proposals,
            {
              id: proposal.id.toString(),
              cid: new CID("f" + proposal.cid.toString().substring(4)).toString(
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
              enabled: proposal.enabled,
              minVotes: minVotes,
              contractAddress: daos[i],
            },
          ]);
        }
      }
    })();
  }, [router.query]);
  console.log(bounties);
  return (
    <AppContainer>
      <div
        style={{
          height: "100%",
          padding: "20px",
        }}
      >
        <Grid>
          {bounties.length > 0 &&
            bounties.map((proposal) => (
              <Grid.Col sm={6} md={4} lg={4} key={proposal.id}>
                <BountyCard
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
                  minVotes={proposal.minVotes}
                  contractAddress={proposal.contractAddress}
                />
              </Grid.Col>
            ))}
        </Grid>
      </div>
    </AppContainer>
  );
}
