/**
 * Comprehensive Test Suite for Hamming(7,4) Error Correction
 * 
 * This test suite validates the mathematical correctness of the Hamming(7,4)
 * error correction implementation used in the retrocausal communication system.
 * The tests ensure that the encoding, decoding, and error correction algorithms
 * work exactly as specified in the theoretical framework.
 * 
 * Test Coverage:
 * - Basic encoding and decoding functionality
 * - Error detection and correction capabilities
 * - Edge cases and error conditions
 * - Mathematical properties verification
 * - Performance characteristics
 * 
 * Author: Tommy Xaypanya, NeuralQuantum.ai
 */

// Simple test framework for browser environment
class TestFramework {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
        this.results = [];
    }

    test(name, testFn) {
        this.tests.push({ name, testFn });
    }

    assertEqual(actual, expected, message = '') {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
            throw new Error(`Assertion failed: ${message}
                Expected: ${JSON.stringify(expected)}
                Actual: ${JSON.stringify(actual)}`);
        }
    }

    assertTrue(condition, message = '') {
        if (!condition) {
            throw new Error(`Assertion failed: ${message}
                Expected: true
                Actual: ${condition}`);
        }
    }

    assertFalse(condition, message = '') {
        if (condition) {
            throw new Error(`Assertion failed: ${message}
                Expected: false
                Actual: ${condition}`);
        }
    }

    assertThrows(fn, expectedError = Error, message = '') {
        try {
            fn();
            throw new Error(`Expected function to throw ${expectedError.name}, but it didn't throw anything`);
        } catch (error) {
            if (!(error instanceof expectedError)) {
                throw new Error(`Expected ${expectedError.name}, but got ${error.constructor.name}: ${error.message}`);
            }
        }
    }

    run() {
        console.log(`Running ${this.tests.length} tests...`);
        
        for (const { name, testFn } of this.tests) {
            try {
                testFn();
                this.passed++;
                this.results.push({ name, status: 'PASS' });
                console.log(`✓ ${name}`);
            } catch (error) {
                this.failed++;
                this.results.push({ name, status: 'FAIL', error: error.message });
                console.error(`✗ ${name}: ${error.message}`);
            }
        }

        console.log(`\nTest Results: ${this.passed} passed, ${this.failed} failed`);
        return { passed: this.passed, failed: this.failed, results: this.results };
    }
}

// Test suite for Hamming(7,4) code
class HammingCodeTests {
    constructor() {
        this.framework = new TestFramework();
        this.hamming = new HammingCode();
        this.setupTests();
    }

    setupTests() {
        // Basic functionality tests
        this.framework.test('Constructor initializes properly', () => this.testConstructor());
        this.framework.test('Encode basic 4-bit inputs', () => this.testBasicEncoding());
        this.framework.test('Decode basic 7-bit codewords', () => this.testBasicDecoding());
        this.framework.test('Round-trip encoding/decoding', () => this.testRoundTrip());
        
        // Error correction tests
        this.framework.test('Single-bit error correction', () => this.testSingleErrorCorrection());
        this.framework.test('No error detection', () => this.testNoErrorDetection());
        this.framework.test('All positions error correction', () => this.testAllPositionErrors());
        
        // Mathematical properties
        this.framework.test('Code properties verification', () => this.testCodeProperties());
        this.framework.test('Generator matrix properties', () => this.testGeneratorMatrix());
        this.framework.test('Parity check matrix properties', () => this.testParityCheckMatrix());
        this.framework.test('Syndrome calculation', () => this.testSyndromeCalculation());
        
        // Edge cases and validation
        this.framework.test('Input validation', () => this.testInputValidation());
        this.framework.test('Invalid input handling', () => this.testInvalidInputs());
        
        // Comprehensive tests
        this.framework.test('All possible inputs', () => this.testAllPossibleInputs());
        this.framework.test('Error injection and correction', () => this.testErrorInjection());
        this.framework.test('Minimum distance property', () => this.testMinimumDistance());
        
        // Performance tests
        this.framework.test('Performance characteristics', () => this.testPerformance());
    }

    testConstructor() {
        this.framework.assertTrue(this.hamming instanceof HammingCode, 'Constructor creates HammingCode instance');
        this.framework.assertTrue(Array.isArray(this.hamming.generatorMatrix), 'Generator matrix is array');
        this.framework.assertEqual(this.hamming.generatorMatrix.length, 7, 'Generator matrix has 7 rows');
        this.framework.assertEqual(this.hamming.generatorMatrix[0].length, 4, 'Generator matrix has 4 columns');
    }

    testBasicEncoding() {
        // Test known encoding examples
        const testCases = [
            { input: [0, 0, 0, 0], expected: [0, 0, 0, 0, 0, 0, 0] },
            { input: [1, 0, 0, 0], expected: [1, 1, 1, 0, 0, 0, 0] },
            { input: [0, 1, 0, 0], expected: [1, 0, 0, 1, 1, 0, 0] },
            { input: [0, 0, 1, 0], expected: [0, 1, 0, 1, 0, 1, 0] },
            { input: [0, 0, 0, 1], expected: [1, 1, 0, 1, 0, 0, 1] },
            { input: [1, 1, 1, 1], expected: [0, 1, 1, 0, 1, 1, 1] }
        ];

        for (const { input, expected } of testCases) {
            const result = this.hamming.encode(input);
            this.framework.assertEqual(result, expected, 
                `Encoding ${input.join('')} should produce ${expected.join('')}`);
        }
    }

    testBasicDecoding() {
        // Test decoding of valid codewords
        const testCases = [
            { input: [0, 0, 0, 0, 0, 0, 0], expected: [0, 0, 0, 0] },
            { input: [1, 1, 1, 0, 0, 0, 0], expected: [1, 0, 0, 0] },
            { input: [1, 0, 0, 1, 1, 0, 0], expected: [0, 1, 0, 0] },
            { input: [0, 1, 0, 1, 0, 1, 0], expected: [0, 0, 1, 0] },
            { input: [1, 1, 0, 1, 0, 0, 1], expected: [0, 0, 0, 1] }
        ];

        for (const { input, expected } of testCases) {
            const result = this.hamming.decode(input);
            this.framework.assertEqual(result.dataBits, expected,
                `Decoding ${input.join('')} should produce ${expected.join('')}`);
            this.framework.assertFalse(result.errorDetected, 'No error should be detected in valid codeword');
        }
    }

    testRoundTrip() {
        // Test that encoding followed by decoding returns original data
        for (let i = 0; i < 16; i++) {
            const originalBits = [
                (i >> 3) & 1,
                (i >> 2) & 1,
                (i >> 1) & 1,
                i & 1
            ];

            const encoded = this.hamming.encode(originalBits);
            const decoded = this.hamming.decode(encoded);

            this.framework.assertEqual(decoded.dataBits, originalBits,
                `Round trip should preserve original data: ${originalBits.join('')}`);
            this.framework.assertFalse(decoded.errorDetected,
                'No error should be detected in perfect round trip');
        }
    }

    testSingleErrorCorrection() {
        // Test correction of single-bit errors in each position
        const originalData = [1, 0, 1, 1];
        const originalCodeword = this.hamming.encode(originalData);

        for (let errorPos = 0; errorPos < 7; errorPos++) {
            const corruptedCodeword = [...originalCodeword];
            corruptedCodeword[errorPos] ^= 1; // Flip the bit

            const result = this.hamming.decode(corruptedCodeword);

            this.framework.assertEqual(result.dataBits, originalData,
                `Single error at position ${errorPos} should be corrected`);
            this.framework.assertTrue(result.errorDetected,
                `Error should be detected at position ${errorPos}`);
            this.framework.assertEqual(result.errorPosition, errorPos,
                `Error position should be correctly identified as ${errorPos}`);
            this.framework.assertEqual(result.correctedCodeword, originalCodeword,
                `Corrected codeword should match original`);
        }
    }

    testNoErrorDetection() {
        // Test that valid codewords don't trigger error detection
        const codebook = this.hamming.generateCodebook();

        for (const entry of codebook) {
            const result = this.hamming.decode(entry.codeword);
            this.framework.assertFalse(result.errorDetected,
                `Valid codeword ${entry.codeword.join('')} should not trigger error detection`);
            this.framework.assertEqual(result.errorPosition, -1,
                'Error position should be -1 for valid codewords');
        }
    }

    testAllPositionErrors() {
        // Systematically test error correction for all data patterns and error positions
        for (let dataValue = 0; dataValue < 16; dataValue++) {
            const dataBits = [
                (dataValue >> 3) & 1,
                (dataValue >> 2) & 1,
                (dataValue >> 1) & 1,
                dataValue & 1
            ];

            const codeword = this.hamming.encode(dataBits);

            for (let errorPos = 0; errorPos < 7; errorPos++) {
                const corruptedCodeword = [...codeword];
                corruptedCodeword[errorPos] ^= 1;

                const result = this.hamming.decode(corruptedCodeword);

                this.framework.assertEqual(result.dataBits, dataBits,
                    `Data ${dataValue.toString(2).padStart(4, '0')}, error pos ${errorPos}: data should be recovered`);
                this.framework.assertTrue(result.errorDetected,
                    `Data ${dataValue.toString(2).padStart(4, '0')}, error pos ${errorPos}: error should be detected`);
                this.framework.assertEqual(result.errorPosition, errorPos,
                    `Data ${dataValue.toString(2).padStart(4, '0')}, error pos ${errorPos}: position should be identified`);
            }
        }
    }

    testCodeProperties() {
        // Test mathematical properties of the code
        const properties = this.hamming.getCodeProperties();

        this.framework.assertEqual(properties.name, 'Hamming(7,4)', 'Code name should be Hamming(7,4)');
        this.framework.assertEqual(properties.n, 7, 'Block length should be 7');
        this.framework.assertEqual(properties.k, 4, 'Information length should be 4');
        this.framework.assertEqual(properties.r, 3, 'Redundancy should be 3');
        this.framework.assertEqual(properties.codeRate, 4/7, 'Code rate should be 4/7');
        this.framework.assertEqual(properties.minimumDistance, 3, 'Minimum distance should be 3');
        this.framework.assertEqual(properties.errorCorrectionCapability, 1, 'Should correct 1 error');
        this.framework.assertEqual(properties.errorDetectionCapability, 2, 'Should detect 2 errors');
        this.framework.assertEqual(properties.totalCodewords, 16, 'Should have 16 total codewords');
    }

    testGeneratorMatrix() {
        // Test properties of the generator matrix
        const G = this.hamming.generatorMatrix;

        // Check dimensions
        this.framework.assertEqual(G.length, 7, 'Generator matrix should have 7 rows');
        this.framework.assertTrue(G.every(row => row.length === 4), 'All rows should have 4 columns');

        // Check that it generates the correct codewords
        for (let i = 0; i < 16; i++) {
            const dataBits = [
                (i >> 3) & 1,
                (i >> 2) & 1,
                (i >> 1) & 1,
                i & 1
            ];

            const expectedCodeword = this.hamming.encode(dataBits);
            
            // Manual matrix multiplication to verify
            const computedCodeword = new Array(7);
            for (let row = 0; row < 7; row++) {
                let bit = 0;
                for (let col = 0; col < 4; col++) {
                    bit ^= G[row][col] * dataBits[col];
                }
                computedCodeword[row] = bit;
            }

            this.framework.assertEqual(computedCodeword, expectedCodeword,
                `Generator matrix should produce correct codeword for data ${i.toString(2).padStart(4, '0')}`);
        }
    }

    testParityCheckMatrix() {
        // Test properties of the parity check matrix
        const H = this.hamming.parityCheckMatrix;

        // Check dimensions
        this.framework.assertEqual(H.length, 3, 'Parity check matrix should have 3 rows');
        this.framework.assertTrue(H.every(row => row.length === 7), 'All rows should have 7 columns');

        // Check that valid codewords have zero syndrome
        const codebook = this.hamming.generateCodebook();
        for (const entry of codebook) {
            const syndrome = this.hamming.calculateSyndrome(entry.codeword);
            this.framework.assertEqual(syndrome, [0, 0, 0],
                `Valid codeword ${entry.codeword.join('')} should have zero syndrome`);
        }
    }

    testSyndromeCalculation() {
        // Test syndrome calculation for known error patterns
        const testCodeword = [1, 1, 1, 0, 0, 0, 0]; // Encoded [1,0,0,0]

        const expectedSyndromes = [
            [1, 0, 0], // Error in position 0
            [0, 1, 0], // Error in position 1
            [1, 1, 0], // Error in position 2
            [0, 0, 1], // Error in position 3
            [1, 0, 1], // Error in position 4
            [0, 1, 1], // Error in position 5
            [1, 1, 1]  // Error in position 6
        ];

        for (let errorPos = 0; errorPos < 7; errorPos++) {
            const corruptedCodeword = [...testCodeword];
            corruptedCodeword[errorPos] ^= 1;

            const syndrome = this.hamming.calculateSyndrome(corruptedCodeword);
            this.framework.assertEqual(syndrome, expectedSyndromes[errorPos],
                `Syndrome for error at position ${errorPos} should be ${expectedSyndromes[errorPos].join('')}`);
            
            const syndromeValue = this.hamming.syndromeToInteger(syndrome);
            this.framework.assertEqual(syndromeValue, errorPos + 1,
                `Syndrome integer value should be ${errorPos + 1} for error at position ${errorPos}`);
        }
    }

    testInputValidation() {
        // Test validation methods
        this.framework.assertTrue(this.hamming.validateDataBits([0, 1, 0, 1]), 'Valid 4-bit array should pass');
        this.framework.assertFalse(this.hamming.validateDataBits([0, 1, 0]), 'Wrong length should fail');
        this.framework.assertFalse(this.hamming.validateDataBits([0, 1, 2, 1]), 'Invalid bit value should fail');
        this.framework.assertFalse(this.hamming.validateDataBits('not array'), 'Non-array should fail');

        this.framework.assertTrue(this.hamming.validateCodeword([0, 1, 0, 1, 1, 0, 1]), 'Valid 7-bit array should pass');
        this.framework.assertFalse(this.hamming.validateCodeword([0, 1, 0, 1]), 'Wrong length should fail');
        this.framework.assertFalse(this.hamming.validateCodeword([0, 1, 2, 1, 1, 0, 1]), 'Invalid bit value should fail');
    }

    testInvalidInputs() {
        // Test that invalid inputs throw appropriate errors
        this.framework.assertThrows(() => this.hamming.encode([0, 1, 2]), Error, 'Invalid data bits should throw');
        this.framework.assertThrows(() => this.hamming.encode([0, 1]), Error, 'Wrong length data should throw');
        this.framework.assertThrows(() => this.hamming.decode([0, 1, 2]), Error, 'Invalid codeword should throw');
        this.framework.assertThrows(() => this.hamming.decode([0, 1, 0, 1]), Error, 'Wrong length codeword should throw');
    }

    testAllPossibleInputs() {
        // Comprehensive test of all 16 possible 4-bit inputs
        const allResults = [];

        for (let i = 0; i < 16; i++) {
            const dataBits = [
                (i >> 3) & 1,
                (i >> 2) & 1,
                (i >> 1) & 1,
                i & 1
            ];

            const encoded = this.hamming.encode(dataBits);
            const decoded = this.hamming.decode(encoded);

            allResults.push({
                input: dataBits,
                encoded: encoded,
                decoded: decoded.dataBits
            });

            // Verify perfect round trip
            this.framework.assertEqual(decoded.dataBits, dataBits,
                `Perfect round trip for input ${i.toString(2).padStart(4, '0')}`);
        }

        // Verify all codewords are unique
        const codewordStrings = allResults.map(r => r.encoded.join(''));
        const uniqueCodewords = new Set(codewordStrings);
        this.framework.assertEqual(uniqueCodewords.size, 16,
            'All 16 codewords should be unique');
    }

    testErrorInjection() {
        // Test error injection functionality
        const originalCodeword = [1, 1, 1, 0, 0, 0, 0];
        
        // Test with zero error rate
        const noErrors = this.hamming.injectErrors(originalCodeword, 0.0);
        this.framework.assertEqual(noErrors, originalCodeword,
            'Zero error rate should produce no errors');

        // Test with 100% error rate (all bits should flip)
        const allErrors = this.hamming.injectErrors(originalCodeword, 1.0);
        const expectedFlipped = originalCodeword.map(bit => 1 - bit);
        this.framework.assertEqual(allErrors, expectedFlipped,
            '100% error rate should flip all bits');

        // Test error rate bounds
        this.framework.assertThrows(() => this.hamming.injectErrors(originalCodeword, -0.1), Error,
            'Negative error rate should throw');
        this.framework.assertThrows(() => this.hamming.injectErrors(originalCodeword, 1.1), Error,
            'Error rate > 1 should throw');
    }

    testMinimumDistance() {
        // Verify the minimum Hamming distance property
        const minDistance = this.hamming.calculateMinimumDistance();
        this.framework.assertEqual(minDistance, 3, 'Minimum distance should be 3');

        // Verify by checking all pairs manually
        const codebook = this.hamming.generateCodebook();
        let actualMinDistance = Infinity;

        for (let i = 0; i < codebook.length; i++) {
            for (let j = i + 1; j < codebook.length; j++) {
                const distance = this.hamming.hammingDistance(
                    codebook[i].codeword, 
                    codebook[j].codeword
                );
                actualMinDistance = Math.min(actualMinDistance, distance);
            }
        }

        this.framework.assertEqual(actualMinDistance, 3,
            'Manually calculated minimum distance should be 3');
    }

    testPerformance() {
        // Basic performance test
        const testData = [1, 0, 1, 1];
        const iterations = 1000;

        // Measure encoding performance
        const encodeStart = performance.now();
        for (let i = 0; i < iterations; i++) {
            this.hamming.encode(testData);
        }
        const encodeTime = performance.now() - encodeStart;

        // Measure decoding performance
        const testCodeword = this.hamming.encode(testData);
        const decodeStart = performance.now();
        for (let i = 0; i < iterations; i++) {
            this.hamming.decode(testCodeword);
        }
        const decodeTime = performance.now() - decodeStart;

        console.log(`Performance: ${iterations} encodings took ${encodeTime.toFixed(2)}ms`);
        console.log(`Performance: ${iterations} decodings took ${decodeTime.toFixed(2)}ms`);

        // Performance should be reasonable (< 1ms per operation on modern hardware)
        this.framework.assertTrue(encodeTime / iterations < 1.0,
            'Encoding should be fast (< 1ms per operation)');
        this.framework.assertTrue(decodeTime / iterations < 1.0,
            'Decoding should be fast (< 1ms per operation)');
    }

    run() {
        console.log('Running Hamming(7,4) Error Correction Tests...');
        return this.framework.run();
    }
}

// Export for use in test runner
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HammingCodeTests;
} else if (typeof window !== 'undefined') {
    window.HammingCodeTests = HammingCodeTests;
}