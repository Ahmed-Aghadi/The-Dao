import { AppContainer } from "@/components/AppContainer";
import { DaoCard } from "@/components/DaoCard";
import { HoverCards } from "@/components/HoverCards";
import { daoFactoryAbi, daoFactoryContractAddress, rpcUrl } from "@/constants";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

export default function Home() {
    const [daos, setDaos] = useState<string[]>([]);
    useEffect(() => {
        (async () => {
            const contractInstance = new ethers.Contract(
                daoFactoryContractAddress,
                daoFactoryAbi,
                ethers.getDefaultProvider(rpcUrl)
            );
            let data = await contractInstance.getDeployedDaos();
            setDaos(data);
        })();
    }, []);
    const divs = daos.map((dao) => {
        return <DaoCard key={dao} daoAddress={dao} />;
    });
    const hrefs = daos.map((dao) => {
        return "/dao?address=" + dao;
    });
    return (
        <AppContainer>
            <div
                style={{
                    backgroundColor: "rgb(20, 20, 20)",
                    height: "100%",
                    width: "100%",
                    paddingTop: "20px",
                }}
            >
                <HoverCards divs={divs} hrefs={hrefs} />
            </div>
        </AppContainer>
    );
}
