// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import lighthouse from "@lighthouse-web3/sdk";
import { SpheronClient, ProtocolEnum } from "@spheron/storage";

const client = new SpheronClient({ token: process.env.SPHERON_TOKEN! });

export const config = {
  api: {
    bodyParser: false,
  },
};

type Data = {
  result: string;
};

const uploadFile = async (file: formidable.File) => {
  // SPHERON
  let currentlyUploaded = 0;

  const { uploadId, bucketId, protocolLink, dynamicLinks } =
    await client.upload(file.filepath, {
      protocol: ProtocolEnum.IPFS,
      name: file.originalFilename || "unnamedFile",
      onUploadInitiated: (uploadId) => {
        console.log(`Upload with id ${uploadId} started...`);
      },
      onChunkUploaded: (uploadedSize, totalSize) => {
        currentlyUploaded += uploadedSize;
        console.log(`Uploaded ${currentlyUploaded} of ${totalSize} Bytes.`);
      },
    });
  console.log(`Upload with id ${uploadId} finished.`);
  console.log(`Bucket id: ${bucketId}`);
  console.log(`Protocol link: ${protocolLink}`);
  console.log(`Dynamic links: ${dynamicLinks}`);
  return protocolLink;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    console.log("uploading file to ipfs");
    const form = new formidable.IncomingForm();
    let cid;
    form.parse(req, async function (err, fields, files) {
      cid = await uploadFile(files.file as formidable.File);
      console.log("uploaded file to ipfs: ", cid);
      return res.status(201).json({ result: cid });
    });
  } else {
    res.status(404).send({ result: "Invalid Request!" });
  }
}
