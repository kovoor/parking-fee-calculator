import type { NextApiRequest, NextApiResponse } from 'next';
import { calculateParkingFee } from '../../utils/parkingFeeCalculator';

type Data = {
  fee: number;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { entryTime, exitTime } = req.body;

  const entryDate = new Date(entryTime);
  const exitDate = new Date(exitTime);

  const fee = calculateParkingFee(entryDate, exitDate);

  res.status(200).json({ fee });
}