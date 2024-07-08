import { useState, FormEvent } from 'react';
import axios from 'axios';
import { Inter } from 'next/font/google';
import { FaParking } from 'react-icons/fa';

const inter = Inter({ subsets: ['latin'] });

type CalculateFeeResponse = {
  fee: number;
};

type CalculateFeeRequest = {
  entryTime: string;
  exitTime: string;
};

const calculateParkingFee = async (data: CalculateFeeRequest): Promise<CalculateFeeResponse> => {
  const response = await axios.post<CalculateFeeResponse>('/api/calculateFee', data);
  return response.data;
};

export default function Home() {
  const [entryTime, setEntryTime] = useState('');
  const [exitTime, setExitTime] = useState('');
  const [message, setMessage] = useState('');
  const [duration, setDuration] = useState<number | null>(null);

  const handleCalculateFee = async (event: FormEvent) => {
    event.preventDefault();
    const entryDate = new Date(entryTime);
    const exitDate = new Date(exitTime);

    if (exitDate <= entryDate) {
      setMessage('Error: Exit time must be after entry time.');
      setDuration(null);
      return;
    }

    try {
      const durationInMinutes = (exitDate.getTime() - entryDate.getTime()) / 60000;
      const feeResponse = await calculateParkingFee({ entryTime, exitTime });
      setDuration(durationInMinutes);
      setMessage(`The parking fee is $${feeResponse.fee.toFixed(2)}`);
    } catch (error) {
      setMessage('Error calculating the parking fee');
    }
  };

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}>
      <div className="z-10 w-full max-w-xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2">
          <FaParking /> Parking Fee Calculator
        </h1>
        <form onSubmit={handleCalculateFee} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Entry Time (example: Month/Day/Year, Hour, Minute AM/PM)
            </label>
            <input
              type="datetime-local"
              value={entryTime}
              onChange={(e) => setEntryTime(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-900 dark:[color-scheme:dark]"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Exit Time
            </label>
            <input
              type="datetime-local"
              value={exitTime}
              onChange={(e) => setExitTime(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-900 dark:[color-scheme:dark]"
              required
            />
          </div>
          <button type="submit" className="w-full px-4 py-2 bg-green-700 text-white font-semibold rounded-md hover:opacity-80">
            Calculate Fee
          </button>
        </form>
        {duration !== null && (
          <div className="mt-4 p-4 border font-light dark:border-gray-300 border-gray-600 rounded-md">
            Parking Duration: {Math.floor(duration / 60)} hours and {Math.floor(duration % 60)} minutes
          </div>
        )}
        {message && (
          <div className="mt-4 p-4 border-2 font-bold border-green-700 text-green-800 dark:text-green-300 rounded-md">
            {message}
          </div>
        )}
      </div>
    </main>
  );
}