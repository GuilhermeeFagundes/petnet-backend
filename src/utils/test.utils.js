/**
 * Utility functions for testing purposes.
 */

/**
 * Generates a valid CPF for testing purposes.
 * @returns {string} A valid 11-digit CPF string.
 */
export const generateCpf = () => {
    const randomDigit = () => Math.floor(Math.random() * 10);
    const generateDigits = (length) => Array.from({ length }, randomDigit);

    const calcDigit = (digits) => {
        let sum = 0;
        for (let i = 0; i < digits.length; i++) {
            sum += digits[i] * (digits.length + 1 - i);
        }
        const rem = (sum * 10) % 11;
        return rem === 10 || rem === 11 ? 0 : rem;
    };

    const base = generateDigits(9);
    base.push(calcDigit(base));
    base.push(calcDigit(base));
    return base.join("");
};
