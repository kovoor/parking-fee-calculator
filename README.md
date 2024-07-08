# Parking Fee Calculator (Charge+)

This is a Parking Fee Calculator built with Next.js (React framework) and TypeScript. The application calculates parking fees based on entry and exit times, taking into account weekday and weekend rates, grace periods, and maximum daily charges.

Demo: https://parking-fee-calculator.vercel.app/


https://github.com/kovoor/parking-fee-calculator/assets/40061443/15ec1c9a-3468-432c-9cda-584bda73dc09

&nbsp;

## Features

- Calculates parking fees for both weekdays and weekends.
- Applies a 15-minute grace period for free parking.
- Charges for the first three hours at a different rate than subsequent hours.
- Caps the maximum daily charge.
- Handles parking periods spanning multiple days including weekends and weekdays.

&nbsp;

## Technologies Used

- Next.js
- TypeScript
- Axios
- Jest (for testing)

&nbsp;

## Installation

1. Clone the repository:

```sh
git clone https://github.com/kovoor/parking-fee-calculator.git
cd parking-fee-calculator
```

2. Install dependencies:

```sh
npm install
```

3. Start the development server:

```sh
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`.

&nbsp;

## Usage

1. Enter the entry time and exit time in the provided input fields.
2. Click the “Calculate Fee” button.
3. The application will display the calculated parking fee and the parking duration.

&nbsp;

## Code Structure

The project has the following structure:

```
.
├── pages
│   ├── api
│   │   └── calculateFee.ts     # API endpoint for fee calculation
│   └── index.tsx               # Main page
├── utils
│   └── parkingFeeCalculator.ts # Utility functions for fee calculation
├── tests
│   └── parkingFeeCalculator.test.ts # Unit tests for fee calculation
├── public
│   └── ...                     # Static files
├── styles
│   └── ...                     # Styling files
├── README.md
├── package.json
└── tsconfig.json
```

&nbsp;

## Main Components

* `ParkingCalculator.tsx`: The main component containing the form and logic for calculating and displaying the parking fee.
* `calculateFee.ts`: The API endpoint that handles the calculation logic on the server side.
* `parkingFeeCalculator.ts`: Utility functions for calculating the parking fee based on given entry and exit times.


&nbsp;

## Running Tests

To run the tests for the parking fee calculation logic, use the following command:

```sh
npm run test
```

The tests are located in the tests directory and use **Jest** for unit testing.

&nbsp;

![CleanShot 2024-07-09 at 02 35 34@2x 2](https://github.com/kovoor/parking-fee-calculator/assets/40061443/dbb05936-33a5-44d0-b98a-266e4b4661b3)


&nbsp;

## License

This project is licensed under the MIT License.

