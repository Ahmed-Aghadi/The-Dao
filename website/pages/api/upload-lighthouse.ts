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
  size?: number;
};

const uploadFile = async (file: formidable.File) => {
  // LightHouse
  const uploadResponse = await lighthouse.upload(
    file.filepath,
    process.env.LIGHTHOUSE_API_KEY!
  );
  console.log(uploadResponse);
  return { result: uploadResponse.data.Hash, size: uploadResponse.data.Size };
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    console.log("uploading file to ipfs");
    const form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
      const result = await uploadFile(files.file as formidable.File);
      console.log("uploaded file to ipfs: ", result);
      return res.status(201).json(result);
    });
  } else {
    res.status(404).send({ result: "Invalid Request!" });
  }
}
