export default function handler(req, res) {
  function generateNumberFromArray(arr) {
    // Validate input
    if (!Array.isArray(arr) || arr.some((num) => num < 1 || num > 4)) {
      throw new Error("Input must be an array of integers containing values from 1 to 4 only.");
    }

    // Define weights for each number
    const weights = {
      1: 2,
      2: 4,
      3: 6,
      4: 8,
    };

    // Calculate the sum of weights
    let weightedSum = 0;
    arr.forEach((num) => {
      weightedSum += weights[num];
    });

    // Normalize the weighted sum to a number between 1 and 10
    const maxPossibleSum = arr.length * 8; // When all elements are 4
    const minPossibleSum = arr.length * 2; // When all elements are 1
    const normalizedNumber = Math.round(((weightedSum - minPossibleSum) / (maxPossibleSum - minPossibleSum)) * 2) + 1;

    return normalizedNumber;
  }
  res.status(200).json({ mentalHealthScore: generateNumberFromArray(Object.values(req.body.ans)) });
}
