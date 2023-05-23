import { AppContainer } from "@/components/AppContainer";
import { Container, FileInput } from "@mantine/core";
import { useAccount, useSigner } from "wagmi";
import { Polybase } from "@polybase/client";
import { ethers } from "ethers";
import { useState } from "react";

import CID from "cids";

const db = new Polybase({
  defaultNamespace:
    "pk/0x2c57ac0fb26925e229569ad92eb06f540da113b565ee2943fb53029e44b2a60f0a3333bac53dcb89baf2f0b8fec75f175ceb1bb5bb658d9c24e89b27c06f606f/General_Use",
});

export default function Home() {
  const { data: signer } = useSigner();

  const [file, setFile] = useState<File | null>(null);

  const signData = async (data: string) => {
    const signature = await signer!.signMessage(data);
    console.log("signature", signature);
    return signature;
  };

  const createDao = async () => {
    if (!signer) return;
    db.signer(async (data) => {
      return {
        h: "eth-personal-sign",
        sig: await signData(data),
      };
    });

    console.log("db", db);

    const daoReference = db.collection("DAO");
    console.log("daoReference", daoReference);
    const recordData = await daoReference.create(["1"]);

    console.log("recordData", recordData);
  };

  const addMembers = async () => {
    if (!signer) return;
    db.signer(async (data) => {
      return {
        h: "eth-personal-sign",
        sig: await signData(data),
      };
    });

    console.log("db", db);

    const daoReference = db.collection("DAO");
    console.log("daoReference", daoReference);

    const recordData = await daoReference
      .record("1")
      .call("addMembers", [
        [
          "0x4CA5FE129837E965e49b507cfE36c0dc574e8864",
          "0x542d1E98251E8962c5D9cd2594F1Fd83381c3950",
        ],
      ]);

    console.log("recordData", recordData);
  };

  const addMessage = async () => {
    if (!signer) return;
    db.signer(async (data) => {
      return {
        h: "eth-personal-sign",
        sig: await signData(data),
      };
    });

    console.log("db", db);

    const daoReference = db.collection("DAO");
    console.log("daoReference", daoReference);
    const daoRecord = await daoReference.record("1");

    const messageReference = db.collection("Message");
    console.log("messageReference", messageReference);
    const messageId = crypto.randomUUID();
    const messageRecordData = await messageReference.create([
      messageId,
      "Hello World 2",
      Date.now(),
      daoRecord,
    ]);
    console.log("messageRecordData", messageRecordData);

    const recordData = await daoRecord.call("addMessage", [
      messageReference.record(messageId),
    ]);

    console.log("recordData", recordData);
  };

  const uploadFile = async () => {
    if (!file) return;
    const body = new FormData();
    body.append("file", file);
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/test", {
      method: "POST",
      body: body,
    });
    console.log("res", res);
    const jsonRes = await res.json();
    console.log("jsonRes", jsonRes);
  };
  function test() {
    const cidHexRaw = new CID("QmWfVY9y3xjsixTgbd9AorQxH7VtMpzfx2HaWtsoUYecaX")
      .toV1()
      .toString("base16")
      .substring(1);
    const cidHex = "0x00" + cidHexRaw;
    console.log("cidHex", cidHex);

    const b = new CID("f" + cidHex.substring(4)).toString("base32");
    console.log("cid", b);

    console.log(
      "CIDD",
      new CID("QmWfVY9y3xjsixTgbd9AorQxH7VtMpzfx2HaWtsoUYecaX")
        .toV1()
        .toString("base32")
    );
  }
  test();

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
          <button onClick={createDao}>Create DAO</button>
          <button onClick={addMembers}>Add Members</button>
          <button onClick={addMessage}>Add Message</button>
          <FileInput
            label="Upload files"
            placeholder="Upload files"
            value={file}
            onChange={setFile}
          />
          <button onClick={uploadFile}>Upload File</button>
        </Container>
      </div>
    </AppContainer>
  );
}
