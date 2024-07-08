type ParkingRate = {
    firstThreeHours: number;
    subsequentHour: number;
    maxCharge: number;
  };
  
  const WEEKDAY_RATE: ParkingRate = { firstThreeHours: 3.0, subsequentHour: 1.5, maxCharge: 20.0 };
  const WEEKEND_RATE: ParkingRate = { firstThreeHours: 5.0, subsequentHour: 2.0, maxCharge: 40.0 };
  
  const getRate = (date: Date): ParkingRate => {
    const day = date.getDay();
    return day === 0 || day === 6 ? WEEKEND_RATE : WEEKDAY_RATE; // 0 is Sunday, 6 is Saturday
  };
  
  const calculateDailyFee = (durationInMinutes: number, rate: ParkingRate): number => {
    const gracePeriodMinutes = 5;
  
    // If the total duration including the grace period is within 15 minutes, it should be free
    if (durationInMinutes <= 15) return 0;
  
    // Exclude grace period for further calculation
    const totalDuration = durationInMinutes - gracePeriodMinutes;
  
    const hours = totalDuration / 60; // Duration in hours
  
    if (hours <= 3) { // Within the first three hours
      return rate.firstThreeHours;
    } else {
      const subsequentHours = Math.ceil(hours - 3); // Duration in subsequent hours
      const fee = rate.firstThreeHours + (subsequentHours * rate.subsequentHour);
      return Math.min(fee, rate.maxCharge);
    }
  };
  
  export const calculateParkingFee = (entryTime: Date, exitTime: Date): number => {
    let totalFee = 0;
    let currentTime = new Date(entryTime);
  
    while (currentTime < exitTime) {
      const nextDay = new Date(currentTime);
      nextDay.setHours(0, 0, 0, 0);
      nextDay.setDate(nextDay.getDate() + 1);
  
      const endOfCurrentPeriod = nextDay < exitTime ? nextDay : exitTime;
      const durationInMinutes = (endOfCurrentPeriod.getTime() - currentTime.getTime()) / 60000; // Duration in minutes
  
      const rate = getRate(currentTime);
      const nextRate = getRate(nextDay);
      let dailyFee;
  
      if (endOfCurrentPeriod <= nextDay) {
        dailyFee = calculateDailyFee(durationInMinutes, rate);
      } else {
        const durationUntilMidnight = (nextDay.getTime() - currentTime.getTime()) / 60000;
        const durationAfterMidnight = durationInMinutes - durationUntilMidnight;
  
        dailyFee = calculateDailyFee(durationUntilMidnight, rate) + calculateDailyFee(durationAfterMidnight, nextRate);
      }
  
      totalFee += dailyFee;
      currentTime = endOfCurrentPeriod;
    }
  
    return totalFee;
  };
  