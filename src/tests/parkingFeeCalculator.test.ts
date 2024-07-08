import { calculateParkingFee } from '../utils/parkingFeeCalculator';

describe('calculateParkingFee', () => {
  it('should return 0 for duration within 15 minutes', () => {
    const entryTime = new Date('2021-10-25T08:16:00');
    const exitTime = new Date('2021-10-25T08:27:00');
    const fee = calculateParkingFee(entryTime, exitTime);
    expect(fee).toBe(0);
  });

  it('should return 0 for exactly 15 minutes', () => {
    const entryTime = new Date('2024-07-05T08:00:00'); // Friday
    const exitTime = new Date('2024-07-05T08:15:00'); // Friday
    const fee = calculateParkingFee(entryTime, exitTime);
    expect(fee).toBe(0); // Exactly 15 minutes including grace period
  });

  it('should return the correct fee if passes initial 15 minutes on weekday', () => {
    const entryTime = new Date('2024-07-05T08:16:00'); // Friday - weekday
    const exitTime = new Date('2024-07-05T08:32:00'); //Friday - weekday
    const fee = calculateParkingFee(entryTime, exitTime);
    expect(fee).toBe(3.0); //first 3 hours weekday rate
  });

  it('should return the correct fee if passes initial 15 minutes on weekend', () => {
    const entryTime = new Date('2024-07-07T08:16:00'); //Sunday - weekend
    const exitTime = new Date('2024-07-07T08:32:00'); //Sunday - weekend
    const fee = calculateParkingFee(entryTime, exitTime);
    expect(fee).toBe(5.0); //first 3 hours weekend rate
  });

  it('should return the correct fee which includes grace period if pass 3 hours', () => {
    const entryTime = new Date('2021-10-25T08:00:00');
    const exitTime = new Date('2021-10-25T11:05:00');
    const fee = calculateParkingFee(entryTime, exitTime);
    expect(fee).toBe(3.0);
  });

  it('should return the correct fee if passes grace period if pass 3 hours', () => {
    const entryTime = new Date('2021-10-25T08:00:00');
    const exitTime = new Date('2021-10-25T11:06:00');
    const fee = calculateParkingFee(entryTime, exitTime);
    expect(fee).toBe(4.5);
  });

  it('should return the correct fee for weekday within grace period', () => {
    const entryTime = new Date('2023-01-25T08:16:00');
    const exitTime = new Date('2023-01-25T12:19:00');
    const fee = calculateParkingFee(entryTime, exitTime);
    expect(fee).toBe(4.5);
  });

  it('should return the correct fee for exactly 3 hours on a weekday', () => {
    const entryTime = new Date('2023-01-25T08:00:00');
    const exitTime = new Date('2023-01-25T11:00:00');
    const fee = calculateParkingFee(entryTime, exitTime);
    expect(fee).toBe(3.0);
  });

  it('should return the correct fee for more than 3 hours on a weekday', () => {
    const entryTime = new Date('2023-01-25T08:00:00');
    const exitTime = new Date('2023-01-25T12:00:00');
    const fee = calculateParkingFee(entryTime, exitTime);
    expect(fee).toBe(4.5); // 3 hours at $3 + 1 hour at $1.5 = $4.50
  });

  it('should return the correct fee for exactly 3 hours on a weekend', () => {
    const entryTime = new Date('2023-01-28T08:00:00'); // Saturday
    const exitTime = new Date('2023-01-28T11:00:00');
    const fee = calculateParkingFee(entryTime, exitTime);
    expect(fee).toBe(5.0);
  });

  it('should return the correct fee for more than 3 hours on a weekend', () => {
    const entryTime = new Date('2023-01-28T08:00:00'); // Saturday
    const exitTime = new Date('2023-01-28T12:00:00');
    const fee = calculateParkingFee(entryTime, exitTime);
    expect(fee).toBe(7.0); // 3 hours at $5 + 1 hour at $2 = $7
  });

  it('should return the correct fee for maximum charge on a weekday', () => {
    const entryTime = new Date('2023-01-25T06:00:00');
    const exitTime = new Date('2023-01-25T23:00:00');
    const fee = calculateParkingFee(entryTime, exitTime);
    expect(fee).toBe(20); // Should cap at maximum charge of $20
  });

  it('should return the correct fee for maximum charge on a weekend', () => {
    const entryTime = new Date('2023-01-28T01:00:00'); // Saturday
    const exitTime = new Date('2023-01-28T23:00:00');
    const fee = calculateParkingFee(entryTime, exitTime);
    expect(fee).toBe(40.0); // Should cap at maximum charge of $40
  });

  it('should return the correct fee for parking spanning multiple days', () => {
    const entryTime = new Date('2023-01-25T08:00:00');
    const exitTime = new Date('2023-01-26T08:00:00');
    const fee = calculateParkingFee(entryTime, exitTime);
    expect(fee).toBe(30.5); // should continue charging normal rate for the second day
  });

  it('should return the correct maximum charge fee for parking spanning multiple days', () => {
    const entryTime = new Date('2023-01-25T06:00:00');
    const exitTime = new Date('2023-01-26T23:00:00');
    const fee = calculateParkingFee(entryTime, exitTime);
    expect(fee).toBe(40); // $20 for each day = $40
  });

  it('should return the correct fee for parking spanning a weekday and a weekend', () => {
    const entryTime = new Date('2023-01-27T06:00:00'); // Friday
    const exitTime = new Date('2023-01-28T12:00:00'); // Saturday
    const fee = calculateParkingFee(entryTime, exitTime);
    expect(fee).toBe(43.0); // $20 for Friday + $23 for Saturday (3 hours at $5 + 1 hour at $2)
  });

  it('should return the correct fee for parking spanning multiple weekdays and weekend', () => {
    const entryTime = new Date('2023-01-27T06:00:00'); // Friday
    const exitTime = new Date('2023-01-30T12:00:00'); // Saturday
    const fee = calculateParkingFee(entryTime, exitTime);
    expect(fee).toBe(116.50); // $20 for Friday + $40 for Saturday + $40 for Sunday + $16.50 for Monday (1 hour at $1.50)
  });

  it('should return the correct fee for parking less than an hour but more than 15 minutes on a weekday', () => {
    const entryTime = new Date('2023-01-25T08:16:00'); // Wednesday
    const exitTime = new Date('2023-01-25T08:45:00'); //Wednesday
    const fee = calculateParkingFee(entryTime, exitTime);
    expect(fee).toBe(3.0); // First 3 hours of weekday rate
  });

  it('should return the correct fee for parking less than an hour but more than 15 minutes on a weekend', () => {
    const entryTime = new Date('2023-01-28T08:16:00'); // Saturday
    const exitTime = new Date('2023-01-28T08:45:00'); // Saturday
    const fee = calculateParkingFee(entryTime, exitTime);
    expect(fee).toBe(5.0); // First 3 hours of weekend rate
  });

  it('should return the correct fee for parking at the transition from weekday to weekend', () => {
    const entryTime = new Date('2024-07-05T23:30:00'); // Friday
    const exitTime = new Date('2024-07-06T00:30:00'); // Saturday
    const fee = calculateParkingFee(entryTime, exitTime);
    expect(fee).toBe(8.0); // First 3 hours of weekday + first 3 hours of weekend rate
  });

  it('should return the correct fee for parking spanning multiple weekdays', () => {
    const entryTime = new Date('2024-07-03T08:00:00'); // Wednesday
    const exitTime = new Date('2024-07-05T08:00:00'); // Friday
    const fee = calculateParkingFee(entryTime, exitTime);
    expect(fee).toBe(50.5); // $20 for each weekday
  });

  it('should return the correct fee for parking spanning multiple weekends', () => {
    const entryTime = new Date('2024-07-06T08:00:00'); // Saturday
    const exitTime = new Date('2024-07-08T08:00:00'); // Monday
    const fee = calculateParkingFee(entryTime, exitTime);
    expect(fee).toBe(81.5); // $40 for each weekend day
  });

  it('should return the correct fee for transition exactly at midnight from weekday to weekend', () => {
    const entryTime = new Date('2024-07-05T23:59:00'); // Friday
    const exitTime = new Date('2024-07-06T00:30:00'); // Saturday
    const fee = calculateParkingFee(entryTime, exitTime);
    expect(fee).toBe(5.0); // First 3 hours of weekend rate
  });

  it('should return the correct fee for transition exactly at midnight from weekend to weekday', () => {
    const entryTime = new Date('2024-07-07T23:59:00'); // Saturday
    const exitTime = new Date('2024-07-08T00:30:00'); // Sunday
    const fee = calculateParkingFee(entryTime, exitTime);
    expect(fee).toBe(3.0); // First 3 hours of weekday rate
  });

  it('should return the correct maximum fee for long duration on a weekday', () => {
    const entryTime = new Date('2024-07-05T08:00:00'); // Friday
    const exitTime = new Date('2024-07-05T23:00:00'); // Friday
    const fee = calculateParkingFee(entryTime, exitTime);
    expect(fee).toBe(20.0); // Cap at maximum charge of $20
  });

  it('should return the correct maximum fee for long duration on a weekend', () => {
    const entryTime = new Date('2024-07-06T01:00:00'); // Saturday
    const exitTime = new Date('2024-07-06T23:00:00'); // Saturday
    const fee = calculateParkingFee(entryTime, exitTime);
    expect(fee).toBe(40); // Cap at maximum charge of $40
  });

  it('should return the correct fee for long duration spanning multiple weeks', () => {
    const entryTime = new Date('2024-06-29T08:00:00'); // Saturday
    const exitTime = new Date('2024-07-10T08:00:00'); // Wednesday
    const fee = calculateParkingFee(entryTime, exitTime);
    expect(fee).toBe(301.5); // Maximum charge for each day
  });
});