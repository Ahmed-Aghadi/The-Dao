import { Container, Group, Text, Textarea } from "@mantine/core";
import { Polybase } from "@polybase/client";
import { IconSend } from "@tabler/icons";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAccount, useSigner } from "wagmi";

const db = new Polybase({
  defaultNamespace:
    "pk/0x2c57ac0fb26925e229569ad92eb06f540da113b565ee2943fb53029e44b2a60f0a3333bac53dcb89baf2f0b8fec75f175ceb1bb5bb658d9c24e89b27c06f606f/General_Use",
});

interface Message {
  id: string;
  message: string;
  timestamp: number;
  owner: string;
}

export function Chat() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { data: signer } = useSigner();
  const { isConnected } = useAccount();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  console.log("messages", messages);

  const signData = async (data: string) => {
    const signature = await signer!.signMessage(data);
    console.log("signature", signature);
    return signature;
  };

  const fetchMessages = async () => {
    const daoReference = db.collection("DAO");
    console.log("daoReference", daoReference);
    const daoRecord = await daoReference
      .record(router.query.address as string)
      .get();
    console.log("daoRecord", daoRecord);

    const messageReference = db.collection("Message");

    const messagesNew: Message[] = [];
    for (let i = 0; i < daoRecord.data.messages.length; i++) {
      const messageRecord = await messageReference
        .record(daoRecord.data.messages[i].id)
        .get();

      messagesNew.push({
        id: messageRecord.data.id,
        message: messageRecord.data.message,
        timestamp: messageRecord.data.timestamp,
        owner: ethers.utils.computeAddress(
          "0x04" + messageRecord.data.owner.slice(2)
        ),
      });
      console.log("messageRecord", messageRecord);
    }
    setMessages(messagesNew);
    setLoading(false);
  };

  const addMessage = async () => {
    if (!signer) return;
    if (!isConnected) return;
    if (!message) return;
    db.signer(async (data) => {
      return {
        h: "eth-personal-sign",
        sig: await signData(data),
      };
    });

    console.log("db", db);

    const daoReference = db.collection("DAO");
    console.log("daoReference", daoReference);
    const daoRecord = await daoReference.record(router.query.address as string);

    const messageReference = db.collection("Message");
    console.log("messageReference", messageReference);
    const messageId = crypto.randomUUID();
    const messageRecordData = await messageReference.create([
      messageId,
      message,
      Date.now(),
      daoRecord,
    ]);
    console.log("messageRecordData", messageRecordData);

    const recordData = await daoRecord.call("addMessage", [
      messageReference.record(messageId),
    ]);

    console.log("recordData", recordData);

    setMessage("");
    fetchMessages();
  };

  useEffect(() => {
    if (!router.query.address) return;
    if (!signer) return;
    fetchMessages();
  }, [router.query.address, signer]);

  // fetch messages automatically every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessages();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const shortenAddress = (address: string) => {
    return address.slice(0, 6) + "..." + address.slice(-4);
  };

  return (
    <div>
      {loading ? (
        <div>LOADING...</div>
      ) : (
        <div>
          <Textarea
            placeholder="message"
            label="Message"
            value={message}
            onChange={(event) => setMessage(event.currentTarget.value)}
            rightSection={<IconSend onClick={() => addMessage()} />}
            mb="lg"
          />

          {messages.map((message) => (
            <Container
              key={message.id}
              sx={{
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: 10,
                marginBottom: 10,
              }}
            >
              <Group>
                <div>
                  <Text>{shortenAddress(message.owner)}</Text>
                </div>
                <div>
                  <Text>{new Date(message.timestamp).toLocaleString()}</Text>
                </div>
              </Group>
              <Text>{message.message}</Text>
            </Container>
          ))}
        </div>
      )}
    </div>
  );
}
