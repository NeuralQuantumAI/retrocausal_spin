/**
 * Hamming(7,4) Error Correction Implementation
 * 
 * This module implements the Hamming(7,4) error correction code as described
 * in the retrocausal communication framework. The code encodes 4 information
 * bits into 7 total bits, enabling single-bit error detection and correction.
 * 
 * The theoretical foundation comes from Hamming's original work on error
 * correction, adapted here for quantum spin state encoding in temporal loops.
 * 
 * Author: Tommy Xaypanya, NeuralQuantum.ai
 */

class HammingCode {
    constructor() {
        // Generator matrix G for Hamming(7,4) code
        // Each row represents how to compute one output bit from input bits
        this.generatorMatrix = [
            [1, 1, 0, 1],  // p1 = d1 ⊕ d2 ⊕ d4
            [1, 0, 1, 1],  // p2 = d1 ⊕ d3 ⊕ d4  
            [1, 0, 0, 0],  // d1 (pass through)
            [0, 1, 1, 1],  // p3 = d2 ⊕ d3 ⊕ d4
            [0, 1, 0, 0],  // d2 (pass through)
            [0, 0, 1, 0],  // d3 (pass through)
            [0, 0, 0, 1]   // d4 (pass through)
        ];

        // Parity check matrix H for syndrome calculation
        // Used to detect and locate errors in received codewords
        this.parityCheckMatrix = [
            [1, 0, 1, 0, 1, 0, 1],  // s1 = c1 ⊕ c3 ⊕ c5 ⊕ c7
            [0, 1, 1, 0, 0, 1, 1],  // s2 = c2 ⊕ c3 ⊕ c6 ⊕ c7
            [0, 0, 0, 1, 1, 1, 1]   // s3 = c4 ⊕ c5 ⊕ c6 ⊕ c7
        ];

        // Mapping from syndrome values to error positions
        // Syndrome = 0 means no error detected
        // Syndrome > 0 indicates error at position (syndrome - 1)
        this.syndromeToErrorPosition = {
            0: -1,  // No error
            1: 0,   // Error in position 1
            2: 1,   // Error in position 2
            3: 2,   // Error in position 3
            4: 3,   // Error in position 4
            5: 4,   // Error in position 5
            6: 5,   // Error in position 6
            7: 6    // Error in position 7
        };
    }

    /**
     * Encode 4 information bits into 7-bit Hamming codeword
     * 
     * This function implements the encoding process that maps classical
     * information bits onto quantum spin orientations. In the retrocausal
     * framework, this encoding must be consistent across temporal boundaries.
     * 
     * @param {Array<number>} dataBits - Array of 4 bits (0 or 1)
     * @returns {Array<number>} - Array of 7 encoded bits
     */
    encode(dataBits) {
        if (!this.validateDataBits(dataBits)) {
            throw new Error('Input must be array of exactly 4 bits (0 or 1)');
        }

        const codeword = new Array(7);
        
        // Apply generator matrix to compute each output bit
        // This is the mathematical heart of the Hamming encoding process
        for (let i = 0; i < 7; i++) {
            let bit = 0;
            for (let j = 0; j < 4; j++) {
                // XOR operation implements addition in binary field GF(2)
                bit ^= this.generatorMatrix[i][j] * dataBits[j];
            }
            codeword[i] = bit;
        }

        // Return codeword in standard Hamming(7,4) format:
        // [p1, p2, d1, p3, d2, d3, d4]
        return codeword;
    }

    /**
     * Decode 7-bit codeword and correct single-bit errors
     * 
     * This function implements error detection and correction using syndrome
     * calculation. In retrocausal systems, this correction occurs within the
     * temporal consistency loop, enhancing stability of fixed-point solutions.
     * 
     * @param {Array<number>} codeword - Array of 7 received bits
     * @returns {Object} - {dataBits, correctedCodeword, errorDetected, errorPosition}
     */
    decode(codeword) {
        if (!this.validateCodeword(codeword)) {
            throw new Error('Input must be array of exactly 7 bits (0 or 1)');
        }

        // Step 1: Calculate syndrome using parity check matrix
        const syndrome = this.calculateSyndrome(codeword);
        const syndromeValue = this.syndromeToInteger(syndrome);
        
        // Step 2: Determine if error exists and its location
        const errorPosition = this.syndromeToErrorPosition[syndromeValue];
        const errorDetected = errorPosition !== -1;
        
        // Step 3: Correct error if detected
        const correctedCodeword = [...codeword];
        if (errorDetected) {
            // Flip the erroneous bit (XOR with 1)
            correctedCodeword[errorPosition] ^= 1;
        }

        // Step 4: Extract information bits from corrected codeword
        // Positions 2, 4, 5, 6 contain the original data bits
        const dataBits = [
            correctedCodeword[2],  // d1
            correctedCodeword[4],  // d2
            correctedCodeword[5],  // d3
            correctedCodeword[6]   // d4
        ];

        return {
            dataBits: dataBits,
            correctedCodeword: correctedCodeword,
            errorDetected: errorDetected,
            errorPosition: errorPosition,
            syndrome: syndrome,
            syndromeValue: syndromeValue
        };
    }

    /**
     * Calculate syndrome for error detection
     * 
     * The syndrome is computed by multiplying the received codeword with
     * the parity check matrix. A non-zero syndrome indicates an error.
     * 
     * @param {Array<number>} codeword - 7-bit received codeword
     * @returns {Array<number>} - 3-bit syndrome
     */
    calculateSyndrome(codeword) {
        const syndrome = new Array(3);
        
        for (let i = 0; i < 3; i++) {
            let bit = 0;
            for (let j = 0; j < 7; j++) {
                bit ^= this.parityCheckMatrix[i][j] * codeword[j];
            }
            syndrome[i] = bit;
        }
        
        return syndrome;
    }

    /**
     * Convert syndrome bit array to integer for lookup
     * 
     * @param {Array<number>} syndrome - 3-bit syndrome array
     * @returns {number} - Integer value 0-7
     */
    syndromeToInteger(syndrome) {
        return syndrome[0] * 1 + syndrome[1] * 2 + syndrome[2] * 4;
    }

    /**
     * Inject random errors into codeword for testing
     * 
     * This function simulates the noise that might occur during retrocausal
     * transmission, allowing us to demonstrate error correction capabilities.
     * 
     * @param {Array<number>} codeword - Original 7-bit codeword
     * @param {number} errorRate - Probability of bit flip (0.0 to 1.0)
     * @returns {Array<number>} - Codeword with injected errors
     */
    injectErrors(codeword, errorRate) {
        const noisyCodeword = [...codeword];
        
        for (let i = 0; i < codeword.length; i++) {
            if (Math.random() < errorRate) {
                noisyCodeword[i] ^= 1;  // Flip the bit
            }
        }
        
        return noisyCodeword;
    }

    /**
     * Generate all valid Hamming(7,4) codewords
     * 
     * This function generates the complete codebook of 16 valid codewords,
     * useful for analyzing the code's mathematical structure and properties.
     * 
     * @returns {Array<Array<number>>} - Array of all 16 valid codewords
     */
    generateCodebook() {
        const codebook = [];
        
        // Generate all possible 4-bit input combinations
        for (let i = 0; i < 16; i++) {
            const dataBits = [
                (i >> 3) & 1,
                (i >> 2) & 1,
                (i >> 1) & 1,
                i & 1
            ];
            
            const codeword = this.encode(dataBits);
            codebook.push({
                input: dataBits,
                codeword: codeword,
                binary: i.toString(2).padStart(4, '0')
            });
        }
        
        return codebook;
    }

    /**
     * Calculate minimum Hamming distance of the code
     * 
     * The minimum distance determines the error correction capability.
     * Hamming(7,4) has minimum distance 3, enabling single-error correction.
     * 
     * @returns {number} - Minimum Hamming distance
     */
    calculateMinimumDistance() {
        const codebook = this.generateCodebook();
        let minDistance = Infinity;
        
        for (let i = 0; i < codebook.length; i++) {
            for (let j = i + 1; j < codebook.length; j++) {
                const distance = this.hammingDistance(
                    codebook[i].codeword, 
                    codebook[j].codeword
                );
                minDistance = Math.min(minDistance, distance);
            }
        }
        
        return minDistance;
    }

    /**
     * Calculate Hamming distance between two codewords
     * 
     * @param {Array<number>} word1 - First codeword
     * @param {Array<number>} word2 - Second codeword
     * @returns {number} - Number of differing bits
     */
    hammingDistance(word1, word2) {
        let distance = 0;
        for (let i = 0; i < word1.length; i++) {
            if (word1[i] !== word2[i]) {
                distance++;
            }
        }
        return distance;
    }

    /**
     * Validate 4-bit data input
     * 
     * @param {Array<number>} dataBits - Input to validate
     * @returns {boolean} - True if valid
     */
    validateDataBits(dataBits) {
        return Array.isArray(dataBits) && 
               dataBits.length === 4 && 
               dataBits.every(bit => bit === 0 || bit === 1);
    }

    /**
     * Validate 7-bit codeword input
     * 
     * @param {Array<number>} codeword - Input to validate
     * @returns {boolean} - True if valid
     */
    validateCodeword(codeword) {
        return Array.isArray(codeword) && 
               codeword.length === 7 && 
               codeword.every(bit => bit === 0 || bit === 1);
    }

    /**
     * Get detailed information about the code structure
     * 
     * @returns {Object} - Code properties and statistics
     */
    getCodeProperties() {
        return {
            name: "Hamming(7,4)",
            n: 7,  // Total bits
            k: 4,  // Information bits
            r: 3,  // Parity bits
            codeRate: 4/7,  // Information rate
            minimumDistance: 3,
            errorCorrectionCapability: 1,  // Single-error correction
            errorDetectionCapability: 2,   // Double-error detection
            totalCodewords: 16,
            redundancy: 3/7
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HammingCode;
} else if (typeof window !== 'undefined') {
    window.HammingCode = HammingCode;
}