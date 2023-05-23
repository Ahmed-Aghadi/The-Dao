import { AppContainer } from "@/components/AppContainer";
import { DataTable } from "@/components/DataTable";
import { daoFactoryAbi, daoFactoryContractAddress, rpcUrl } from "@/constants";
import { Container } from "@mantine/core";
import { Database } from "@tableland/sdk";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useSigner } from "wagmi";

interface RowData {
  dao: string;
  dealId: string;
  id: string;
  provider: string;
  proposolId: string;
}
interface RowDataTemp {
  dao: string;
  dealId: string;
  id: number;
  provider: string;
  proposolId: string;
}

export default function Home() {
  const { data: signer } = useSigner();
  const [data, setData] = useState<RowData[]>([]);

  useEffect(() => {
    if (!signer) return;
    fetchAndSetData();
  }, [signer]);

  const fetchAndSetData = async () => {
    const contractInstance = new ethers.Contract(
      daoFactoryContractAddress,
      daoFactoryAbi,
      signer ? signer : ethers.getDefaultProvider(rpcUrl)
    );
    const res = await contractInstance.getTableName();
    console.log("tableName: ", res);

    const tableName = res; // Our pre-defined health check table

    const db = new Database();

    const { results } = await db.prepare(`SELECT * FROM ${tableName};`).all();

    console.log("results: ", results);
    let temp: RowDataTemp[] = results as RowDataTemp[];
    let temp2: RowData[] = temp.map((item) => {
      return {
        ...item,
        id: item.id.toString(),
      };
    });
    console.log("temp2: ", temp2);
    setData(temp2);
  };

  return (
    <AppContainer>
      <div
        style={{
          backgroundColor: "rgb(20, 20, 20)",
          height: "100%",
          width: "100%",
        }}
      >
        <Container size="lg" py="xl">
          {data.length !== 0 && <DataTable data={data} />}
        </Container>
      </div>
    </AppContainer>
  );
}
