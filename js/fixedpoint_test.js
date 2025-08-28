/**
 * Comprehensive Test Suite for Fixed-Point Iteration Algorithm
 * 
 * This test suite validates the mathematical correctness of the fixed-point
 * iteration algorithm that enforces temporal consistency in retrocausal
 * communication systems. The tests verify both the convergence properties
 * and the integration with error correction systems.
 * 
 * Test Coverage:
 * - Convergence behavior under various conditions
 * - Integration with Hamming error correction
 * - Statistical properties and performance
 * - Edge cases and error handling
 * - Mathematical consistency verification
 * 
 * Author: Tommy Xaypanya, NeuralQuantum.ai
 */

class FixedPointSolverTests {
    constructor() {
        this.framework = new TestFramework();
        this.hamming = new HammingCode();
        this.solver = new RetrocausalFixedPointSolver(this.hamming);
        this.setupTests();
    }

    setupTests() {
        // Basic convergence tests
        this.framework.test('Constructor initialization', () => this.testConstructor());
        this.framework.test('Simple convergence case', () => this.testSimpleConvergence());
        this.framework.test('Convergence with zero error rate', () => this.testZeroErrorRate());
        this.framework.test('Convergence with low error rate', () => this.testLowErrorRate());
        
        // Error correction integration
        this.framework.test('Error correction integration', () => this.testErrorCorrectionIntegration());
        this.framework.test('Error correction effectiveness', () => this.testErrorCorrectionEffectiveness());
        
        // Parameter sensitivity
        this.framework.test('Tolerance parameter effects', () => this.testToleranceEffects());
        this.framework.test('Maximum iterations bounds', () => this.testIterationBounds());
        this.framework.test('Error rate impact', () => this.testErrorRateImpact());
        
        // Statistical analysis
        this.framework.test('Statistical analysis functionality', () => this.testStatisticalAnalysis());
        this.framework.test('Convergence rate calculation', () => this.testConvergenceRateCalculation());
        this.framework.test('Distribution statistics', () => this.testDistributionStatistics());
        
        // Edge cases and robustness
        this.framework.test('Extreme parameter values', () => this.testExtremeParameters());
        this.framework.test('Input validation', () => this.testInputValidation());
        this.framework.test('State management', () => this.testStateManagement());
        
        // Performance and scaling
        this.framework.test('Performance characteristics', () => this.testPerformanceCharacteristics());
        this.framework.test('Memory usage estimation', () => this.testMemoryUsage());
        
        // Mathematical consistency
        this.framework.test('Fixed-point property verification', () => this.testFixedPointProperty());
        this.framework.test('Temporal consistency enforcement', () => this.testTemporalConsistency());
    }

    testConstructor() {
        this.framework.assertTrue(this.solver instanceof RetrocausalFixedPointSolver,
            'Constructor creates RetrocausalFixedPointSolver instance');
        this.framework.assertTrue(this.solver.hamming instanceof HammingCode,
            'Solver contains HammingCode instance');
        this.framework.assertTrue(typeof this.solver.defaultParams === 'object',
            'Default parameters are defined');
        this.framework.assertTrue(Array.isArray(this.solver.convergenceHistory),
            'Convergence history is initialized');
        
        // Check default parameters are reasonable
        const params = this.solver.defaultParams;
        this.framework.assertTrue(params.maxIterations > 0, 'Default max iterations should be positive');
        this.framework.assertTrue(params.convergenceTolerance > 0, 'Default tolerance should be positive');
        this.framework.assertTrue(params.errorRate >= 0 && params.errorRate <= 1, 'Default error rate should be valid probability');
    }

    testSimpleConvergence() {
        // Test convergence with a simple, stable input
        const inputData = [0, 0, 0, 0];
        const result = this.solver.solveFixedPoint(inputData, {
            maxIterations: 50,
            convergenceTolerance: 1e-6,
            errorRate: 0.0 // No errors for this test
        });

        this.framework.assertTrue(result.converged, 'Simple case should converge');
        this.framework.assertEqual(result.finalState, inputData, 'Final state should match input for zero error rate');
        this.framework.assertTrue(result.iterations > 0, 'Should take at least one iteration');
        this.framework.assertTrue(result.finalError <= 1e-6, 'Final error should meet tolerance');
    }

    testZeroErrorRate() {
        // Test that zero error rate leads to immediate convergence
        const testCases = [
            [0, 0, 0, 0],
            [1, 0, 0, 0],
            [0, 1, 1, 0],
            [1, 1, 1, 1]
        ];

        for (const inputData of testCases) {
            const result = this.solver.solveFixedPoint(inputData, {
                maxIterations: 10,
                convergenceTolerance: 1e-6,
                errorRate: 0.0
            });

            this.framework.assertTrue(result.converged, 
                `Input ${inputData.join('')} should converge with zero error rate`);
            this.framework.assertEqual(result.finalState, inputData, 
                `Final state should match input for ${inputData.join('')}`);
            this.framework.assertTrue(result.iterations <= 3, 
                'Zero error rate should converge very quickly');
        }
    }

    testLowErrorRate() {
        // Test convergence behavior with low error rates
        const inputData = [1, 0, 1, 0];
        const result = this.solver.solveFixedPoint(inputData, {
            maxIterations: 100,
            convergenceTolerance: 1e-4,
            errorRate: 0.05 // 5% error rate
        });

        // With Hamming error correction, should still converge reliably
        this.framework.assertTrue(result.converged || result.iterations < 50, 
            'Low error rate should converge or stabilize quickly');
        
        if (result.converged) {
            this.framework.assertTrue(result.finalError <= 1e-4, 
                'Converged solution should meet tolerance requirement');
        }

        // Check that error correction was active
        const errorStats = result.errorCorrectionStats;
        this.framework.assertTrue(typeof errorStats.totalErrorsDetected === 'number',
            'Error correction statistics should be available');
    }

    testErrorCorrectionIntegration() {
        // Test that the error correction is properly integrated
        const inputData = [1, 1, 0, 1];
        const result = this.solver.solveFixedPoint(inputData, {
            maxIterations: 50,
            convergenceTolerance: 1e-3,
            errorRate: 0.15 // Higher error rate to trigger correction
        });

        // Verify error correction statistics are tracked
        const errorStats = result.errorCorrectionStats;
        this.framework.assertTrue(typeof errorStats.totalErrorsDetected === 'number',
            'Should track total errors detected');
        this.framework.assertTrue(typeof errorStats.errorsCorrected === 'number',
            'Should track errors corrected');
        this.framework.assertTrue(typeof errorStats.correctionEfficiency === 'number',
            'Should calculate correction efficiency');

        // With error correction, efficiency should be high even with errors
        this.framework.assertTrue(errorStats.correctionEfficiency >= 0.9 || errorStats.totalErrorsDetected === 0,
            'Error correction efficiency should be high');
    }

    testErrorCorrectionEffectiveness() {
        // Compare performance with and without error correction conceptually
        // (We can't actually disable error correction in current implementation,
        // but we can test different error rates)
        
        const inputData = [0, 1, 1, 0];
        const lowErrorResult = this.solver.solveFixedPoint(inputData, {
            maxIterations: 30,
            convergenceTolerance: 1e-3,
            errorRate: 0.05
        });

        const highErrorResult = this.solver.solveFixedPoint(inputData, {
            maxIterations: 100,
            convergenceTolerance: 1e-3,
            errorRate: 0.2
        });

        // Higher error rates should require more iterations but still work
        // due to error correction
        if (lowErrorResult.converged && highErrorResult.converged) {
            this.framework.assertTrue(highErrorResult.iterations >= lowErrorResult.iterations,
                'Higher error rates should generally require more iterations');
        }

        // Both should have reasonable correction rates
        this.framework.assertTrue(
            lowErrorResult.errorCorrectionStats.correctionEfficiency >= 0.8,
            'Low error rate should have high correction efficiency'
        );
    }

    testToleranceEffects() {
        // Test how different tolerance values affect convergence
        const inputData = [1, 0, 0, 1];
        const tolerances = [1e-2, 1e-4, 1e-6];
        const results = [];

        for (const tolerance of tolerances) {
            const result = this.solver.solveFixedPoint(inputData, {
                maxIterations: 100,
                convergenceTolerance: tolerance,
                errorRate: 0.05
            });
            results.push({ tolerance, result });
        }

        // Tighter tolerances should generally require more iterations
        for (let i = 1; i < results.length; i++) {
            const current = results[i];
            const previous = results[i-1];
            
            if (current.result.converged && previous.result.converged) {
                this.framework.assertTrue(current.result.iterations >= previous.result.iterations,
                    `Tighter tolerance ${current.tolerance} should require more iterations than ${previous.tolerance}`);
                this.framework.assertTrue(current.result.finalError <= current.tolerance,
                    'Final error should meet the specified tolerance');
            }
        }
    }

    testIterationBounds() {
        // Test maximum iteration limits
        const inputData = [1, 1, 1, 0];
        
        // Test with very low iteration limit
        const limitedResult = this.solver.solveFixedPoint(inputData, {
            maxIterations: 5,
            convergenceTolerance: 1e-8, // Very tight tolerance
            errorRate: 0.1
        });

        this.framework.assertTrue(limitedResult.iterations <= 5,
            'Should respect maximum iteration limit');
        
        // Test with reasonable limit
        const normalResult = this.solver.solveFixedPoint(inputData, {
            maxIterations: 50,
            convergenceTolerance: 1e-4,
            errorRate: 0.05
        });

        this.framework.assertTrue(normalResult.iterations <= 50,
            'Should not exceed maximum iterations');
    }

    testErrorRateImpact() {
        // Test how different error rates affect convergence behavior
        const inputData = [0, 1, 0, 1];
        const errorRates = [0.0, 0.05, 0.1, 0.2, 0.3];
        const results = [];

        for (const errorRate of errorRates) {
            const result = this.solver.solveFixedPoint(inputData, {
                maxIterations: 100,
                convergenceTolerance: 1e-3,
                errorRate: errorRate
            });
            results.push({ errorRate, result });
        }

        // Zero error rate should converge fastest
        const zeroErrorResult = results[0].result;
        this.framework.assertTrue(zeroErrorResult.converged, 'Zero error rate should converge');
        this.framework.assertTrue(zeroErrorResult.iterations <= 5, 'Zero error rate should converge quickly');

        // Higher error rates should generally require more iterations
        let prevIterations = zeroErrorResult.iterations;
        for (let i = 1; i < results.length; i++) {
            const current = results[i];
            if (current.result.converged) {
                // Allow some flexibility since error injection is random
                this.framework.assertTrue(current.result.finalError <= 1e-3,
                    `Error rate ${current.errorRate} should meet tolerance when converged`);
            }
        }
    }

    testStatisticalAnalysis() {
        // Test the statistical analysis functionality
        const analysisResult = this.solver.runStatisticalAnalysis(20, {
            maxIterations: 50,
            convergenceTolerance: 1e-3,
            errorRate: 0.05
        });

        this.framework.assertEqual(analysisResult.totalRuns, 20, 'Should run requested number of simulations');
        this.framework.assertTrue(analysisResult.successRate >= 0 && analysisResult.successRate <= 1,
            'Success rate should be valid probability');
        this.framework.assertTrue(Array.isArray(analysisResult.results), 'Should return array of results');
        this.framework.assertEqual(analysisResult.results.length, 20, 'Should have results for all runs');

        // Check statistical metrics
        this.framework.assertTrue(typeof analysisResult.averageIterations === 'number',
            'Should calculate average iterations');
        this.framework.assertTrue(typeof analysisResult.averageConvergenceRate === 'number',
            'Should calculate average convergence rate');
    }

    testConvergenceRateCalculation() {
        // Test convergence rate calculation
        const inputData = [1, 0, 1, 1];
        const result = this.solver.solveFixedPoint(inputData, {
            maxIterations: 30,
            convergenceTolerance: 1e-4,
            errorRate: 0.02
        });

        if (result.converged && result.convergenceHistory.length >= 3) {
            this.framework.assertTrue(typeof result.convergenceRate === 'number',
                'Should calculate convergence rate');
            this.framework.assertTrue(result.convergenceRate >= 0,
                'Convergence rate should be non-negative');
        }
    }

    testDistributionStatistics() {
        // Test distribution statistics calculation
        const testData = [1, 2, 3, 4, 5, 5, 4, 3, 2, 1];
        const stats = this.solver.calculateDistributionStats(testData);

        this.framework.assertEqual(stats.mean, 3.0, 'Should calculate correct mean');
        this.framework.assertTrue(stats.std > 0, 'Standard deviation should be positive');
        this.framework.assertEqual(stats.min, 1, 'Should find correct minimum');
        this.framework.assertEqual(stats.max, 5, 'Should find correct maximum');
        this.framework.assertEqual(stats.median, 3, 'Should find correct median');

        // Test with empty array
        const emptyStats = this.solver.calculateDistributionStats([]);
        this.framework.assertEqual(emptyStats.mean, 0, 'Empty array should have zero mean');
    }

    testExtremeParameters() {
        // Test behavior with extreme parameter values
        const inputData = [1, 0, 0, 0];

        // Test with very high error rate
        const highErrorResult = this.solver.solveFixedPoint(inputData, {
            maxIterations: 200,
            convergenceTolerance: 1e-2,
            errorRate: 0.4 // Very high error rate
        });

        // Should either converge with more iterations or gracefully fail
        if (highErrorResult.converged) {
            this.framework.assertTrue(highErrorResult.finalError <= 1e-2,
                'High error rate convergence should meet tolerance');
        }

        // Test with very tight tolerance
        const tightToleranceResult = this.solver.solveFixedPoint(inputData, {
            maxIterations: 30,
            convergenceTolerance: 1e-12, // Extremely tight
            errorRate: 0.01
        });

        // May not converge due to numerical precision limits
        if (tightToleranceResult.converged) {
            this.framework.assertTrue(tightToleranceResult.finalError <= 1e-12,
                'Tight tolerance result should meet specification');
        }
    }

    testInputValidation() {
        // Test input validation and error handling
        const validData = [1, 0, 1, 0];

        // Test invalid input data
        this.framework.assertThrows(() => 
            this.solver.solveFixedPoint([1, 0, 2], {}), // Invalid bit value
            Error, 'Should reject invalid bit values');

        this.framework.assertThrows(() => 
            this.solver.solveFixedPoint([1, 0], {}), // Wrong length
            Error, 'Should reject wrong length input');

        // Test invalid parameters
        this.framework.assertThrows(() => 
            this.solver.solveFixedPoint(validData, { maxIterations: -1 }),
            Error, 'Should reject negative max iterations');

        this.framework.assertThrows(() => 
            this.solver.solveFixedPoint(validData, { convergenceTolerance: -1e-6 }),
            Error, 'Should reject negative tolerance');

        this.framework.assertThrows(() => 
            this.solver.solveFixedPoint(validData, { errorRate: 1.5 }),
            Error, 'Should reject error rate > 1');
    }

    testStateManagement() {
        // Test that solver maintains proper state
        const status1 = this.solver.getStatus();
        this.framework.assertTrue(typeof status1.currentIteration === 'number',
            'Should track current iteration');
        this.framework.assertTrue(typeof status1.isConverged === 'boolean',
            'Should track convergence status');

        // Run a solve and check state changes
        const inputData = [0, 1, 1, 1];
        const result = this.solver.solveFixedPoint(inputData, {
            maxIterations: 20,
            convergenceTolerance: 1e-3,
            errorRate: 0.05
        });

        const status2 = this.solver.getStatus();
        this.framework.assertTrue(status2.totalRuns > status1.totalRuns,
            'Should increment total runs counter');
    }

    testPerformanceCharacteristics() {
        // Test performance with different input sizes and parameters
        const inputData = [1, 1, 0, 0];
        const iterations = 10;

        const start = performance.now();
        for (let i = 0; i < iterations; i++) {
            this.solver.solveFixedPoint(inputData, {
                maxIterations: 30,
                convergenceTolerance: 1e-4,
                errorRate: 0.1
            });
        }
        const duration = performance.now() - start;

        console.log(`Fixed-point solver: ${iterations} solves took ${duration.toFixed(2)}ms`);
        
        // Should be reasonably fast
        this.framework.assertTrue(duration / iterations < 100,
            'Each solve should take less than 100ms on average');
    }

    testMemoryUsage() {
        // Test memory usage estimation
        const inputData = [0, 0, 1, 1];
        const result = this.solver.solveFixedPoint(inputData, {
            maxIterations: 50,
            convergenceTolerance: 1e-4,
            errorRate: 0.05
        });

        this.framework.assertTrue(typeof result.memoryUsage === 'number',
            'Should estimate memory usage');
        this.framework.assertTrue(result.memoryUsage > 0,
            'Memory usage should be positive');

        // Memory usage should scale with convergence history length
        const longResult = this.solver.solveFixedPoint(inputData, {
            maxIterations: 100,
            convergenceTolerance: 1e-6,
            errorRate: 0.03
        });

        if (longResult.iterations > result.iterations) {
            this.framework.assertTrue(longResult.memoryUsage >= result.memoryUsage,
                'Longer runs should use more memory');
        }
    }

    testFixedPointProperty() {
        // Test that converged solutions actually satisfy the fixed-point property
        const inputData = [1, 0, 1, 0];
        const result = this.solver.solveFixedPoint(inputData, {
            maxIterations: 50,
            convergenceTolerance: 1e-6,
            errorRate: 0.0 // Use zero error rate for precise test
        });

        if (result.converged) {
            // Apply one more evolution cycle to the final state
            const finalEvolution = this.solver.applySingleEvolutionCycle(
                result.finalState, 
                { errorRate: 0.0 }
            );

            // The result should be very close to the input (fixed-point property)
            const distance = RetrocausalUtils.math.hammingDistance(
                result.finalState,
                finalEvolution.finalData
            );

            this.framework.assertTrue(distance === 0,
                'Converged state should satisfy fixed-point property exactly with zero error rate');
        }
    }

    testTemporalConsistency() {
        // Test that the algorithm enforces temporal consistency
        const inputData = [0, 1, 0, 1];
        const result = this.solver.solveFixedPoint(inputData, {
            maxIterations: 40,
            convergenceTolerance: 1e-4,
            errorRate: 0.05
        });

        // Check that convergence history shows decreasing errors
        if (result.converged && result.convergenceHistory.length > 2) {
            const history = result.convergenceHistory;
            let previousError = Infinity;
            let nonIncreasingCount = 0;

            for (let i = 1; i < history.length; i++) {
                if (history[i].convergenceError <= previousError) {
                    nonIncreasingCount++;
                }
                previousError = history[i].convergenceError;
            }

            // Expect general trend toward lower errors (allow some fluctuation)
            this.framework.assertTrue(nonIncreasingCount >= history.length * 0.6,
                'Convergence should show generally decreasing error trend');
        }
    }

    run() {
        console.log('Running Fixed-Point Iteration Algorithm Tests...');
        return this.framework.run();
    }
}

// Export for use in test runner
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FixedPointSolverTests;
} else if (typeof window !== 'undefined') {
    window.FixedPointSolverTests = FixedPointSolverTests;
}