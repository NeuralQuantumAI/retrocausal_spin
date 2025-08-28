/**
 * Utility Functions for Retrocausal Spin Communication Simulator
 * 
 * This module provides mathematical utilities, data validation, formatting
 * helpers, and interface support functions that are used throughout the
 * educational application. These utilities ensure consistency and reliability
 * across all components.
 * 
 * Categories:
 * - Mathematical utilities for quantum information calculations
 * - Data validation and conversion functions
 * - Formatting and display helpers
 * - Statistical analysis tools
 * - Performance monitoring utilities
 * 
 * Author: Tommy Xaypanya, NeuralQuantum.ai
 */

class RetrocausalUtils {
    
    /**
     * Mathematical utility functions for quantum information theory
     */
    static math = {
        
        /**
         * Calculate von Neumann entropy of a quantum state
         * S(ρ) = -Tr(ρ log ρ) = -Σᵢ λᵢ log λᵢ
         * 
         * @param {Array<number>} eigenvalues - Eigenvalues of density matrix
         * @returns {number} - von Neumann entropy in bits
         */
        vonNeumannEntropy(eigenvalues) {
            if (!Array.isArray(eigenvalues) || eigenvalues.length === 0) {
                return 0;
            }
            
            let entropy = 0;
            for (const lambda of eigenvalues) {
                if (lambda > 0) {
                    entropy -= lambda * Math.log2(lambda);
                }
            }
            
            return entropy;
        },

        /**
         * Calculate Hamming distance between two bit arrays
         * 
         * @param {Array<number>} bits1 - First bit array
         * @param {Array<number>} bits2 - Second bit array
         * @returns {number} - Number of differing positions
         */
        hammingDistance(bits1, bits2) {
            if (!Array.isArray(bits1) || !Array.isArray(bits2)) {
                throw new Error('Both inputs must be arrays');
            }
            
            if (bits1.length !== bits2.length) {
                throw new Error('Arrays must have equal length');
            }
            
            let distance = 0;
            for (let i = 0; i < bits1.length; i++) {
                if (bits1[i] !== bits2[i]) {
                    distance++;
                }
            }
            
            return distance;
        },

        /**
         * Calculate mutual information between two probability distributions
         * I(X;Y) = Σᵢⱼ p(xᵢ,yⱼ) log₂(p(xᵢ,yⱼ) / (p(xᵢ)p(yⱼ)))
         * 
         * @param {Array<Array<number>>} jointProb - Joint probability matrix
         * @returns {number} - Mutual information in bits
         */
        mutualInformation(jointProb) {
            if (!Array.isArray(jointProb) || jointProb.length === 0) {
                return 0;
            }
            
            const rows = jointProb.length;
            const cols = jointProb[0].length;
            
            // Calculate marginal probabilities
            const marginalX = new Array(rows).fill(0);
            const marginalY = new Array(cols).fill(0);
            
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    marginalX[i] += jointProb[i][j];
                    marginalY[j] += jointProb[i][j];
                }
            }
            
            // Calculate mutual information
            let mutualInfo = 0;
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    const pxy = jointProb[i][j];
                    const px = marginalX[i];
                    const py = marginalY[j];
                    
                    if (pxy > 0 && px > 0 && py > 0) {
                        mutualInfo += pxy * Math.log2(pxy / (px * py));
                    }
                }
            }
            
            return mutualInfo;
        },

        /**
         * Generate random bit array for testing
         * 
         * @param {number} length - Length of bit array
         * @param {number} probability - Probability of bit being 1
         * @returns {Array<number>} - Random bit array
         */
        randomBits(length, probability = 0.5) {
            return Array.from({ length }, () => Math.random() < probability ? 1 : 0);
        },

        /**
         * Calculate binomial coefficient C(n,k) = n! / (k!(n-k)!)
         * 
         * @param {number} n - Total number of items
         * @param {number} k - Number of items to choose
         * @returns {number} - Binomial coefficient
         */
        binomialCoefficient(n, k) {
            if (k > n || k < 0) return 0;
            if (k === 0 || k === n) return 1;
            
            // Use symmetry property: C(n,k) = C(n,n-k)
            if (k > n - k) k = n - k;
            
            let result = 1;
            for (let i = 0; i < k; i++) {
                result *= (n - i);
                result /= (i + 1);
            }
            
            return Math.round(result);
        },

        /**
         * Calculate exponential moving average for convergence analysis
         * 
         * @param {Array<number>} values - Time series values
         * @param {number} alpha - Smoothing parameter (0 < α < 1)
         * @returns {Array<number>} - Smoothed values
         */
        exponentialMovingAverage(values, alpha = 0.1) {
            if (!Array.isArray(values) || values.length === 0) {
                return [];
            }
            
            const smoothed = [values[0]];
            for (let i = 1; i < values.length; i++) {
                const ema = alpha * values[i] + (1 - alpha) * smoothed[i - 1];
                smoothed.push(ema);
            }
            
            return smoothed;
        }
    };

    /**
     * Data validation utilities
     */
    static validation = {
        
        /**
         * Validate bit array input
         * 
         * @param {Array<number>} bits - Bit array to validate
         * @param {number} expectedLength - Expected array length (optional)
         * @returns {boolean} - True if valid
         */
        isBitArray(bits, expectedLength = null) {
            if (!Array.isArray(bits)) return false;
            if (expectedLength !== null && bits.length !== expectedLength) return false;
            return bits.every(bit => bit === 0 || bit === 1);
        },

        /**
         * Validate probability value
         * 
         * @param {number} p - Probability to validate
         * @returns {boolean} - True if valid probability (0 ≤ p ≤ 1)
         */
        isProbability(p) {
            return typeof p === 'number' && p >= 0 && p <= 1;
        },

        /**
         * Validate matrix dimensions
         * 
         * @param {Array<Array<number>>} matrix - Matrix to validate
         * @param {number} expectedRows - Expected number of rows
         * @param {number} expectedCols - Expected number of columns
         * @returns {boolean} - True if dimensions match
         */
        hasValidDimensions(matrix, expectedRows, expectedCols) {
            if (!Array.isArray(matrix) || matrix.length !== expectedRows) {
                return false;
            }
            
            return matrix.every(row => 
                Array.isArray(row) && row.length === expectedCols
            );
        },

        /**
         * Validate convergence parameters
         * 
         * @param {Object} params - Parameters to validate
         * @returns {boolean} - True if all parameters are valid
         */
        convergenceParameters(params) {
            const required = ['maxIterations', 'tolerance', 'errorRate'];
            
            // Check required fields exist
            if (!required.every(field => field in params)) {
                return false;
            }
            
            // Validate parameter ranges
            return (
                Number.isInteger(params.maxIterations) && params.maxIterations > 0 &&
                params.tolerance > 0 && params.tolerance < 1 &&
                this.isProbability(params.errorRate)
            );
        },

        /**
         * Sanitize user input to prevent XSS
         * 
         * @param {string} input - User input string
         * @returns {string} - Sanitized string
         */
        sanitizeInput(input) {
            if (typeof input !== 'string') return '';
            
            return input
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;')
                .replace(/\//g, '&#x2F;');
        }
    };

    /**
     * Formatting utilities for display
     */
    static format = {
        
        /**
         * Format number with appropriate precision
         * 
         * @param {number} value - Number to format
         * @param {number} precision - Decimal places
         * @returns {string} - Formatted number string
         */
        number(value, precision = 3) {
            if (!isFinite(value)) return 'N/A';
            
            if (Math.abs(value) < Math.pow(10, -precision)) {
                return value.toExponential(precision - 1);
            }
            
            return value.toFixed(precision);
        },

        /**
         * Format percentage with proper symbol
         * 
         * @param {number} value - Decimal percentage (0-1)
         * @param {number} precision - Decimal places
         * @returns {string} - Formatted percentage string
         */
        percentage(value, precision = 1) {
            if (!isFinite(value)) return 'N/A';
            return `${(value * 100).toFixed(precision)}%`;
        },

        /**
         * Format bit array as string
         * 
         * @param {Array<number>} bits - Bit array
         * @param {string} separator - Separator between bits
         * @returns {string} - Formatted bit string
         */
        bitArray(bits, separator = '') {
            if (!Array.isArray(bits)) return '';
            return bits.join(separator);
        },

        /**
         * Format time duration in human-readable format
         * 
         * @param {number} milliseconds - Duration in milliseconds
         * @returns {string} - Formatted duration string
         */
        duration(milliseconds) {
            if (milliseconds < 1000) {
                return `${milliseconds.toFixed(0)}ms`;
            }
            
            const seconds = milliseconds / 1000;
            if (seconds < 60) {
                return `${seconds.toFixed(1)}s`;
            }
            
            const minutes = seconds / 60;
            return `${minutes.toFixed(1)}m`;
        },

        /**
         * Format file size in human-readable units
         * 
         * @param {number} bytes - Size in bytes
         * @returns {string} - Formatted size string
         */
        fileSize(bytes) {
            const units = ['B', 'KB', 'MB', 'GB'];
            let size = bytes;
            let unitIndex = 0;
            
            while (size >= 1024 && unitIndex < units.length - 1) {
                size /= 1024;
                unitIndex++;
            }
            
            return `${size.toFixed(1)} ${units[unitIndex]}`;
        },

        /**
         * Format scientific notation for display
         * 
         * @param {number} value - Number to format
         * @param {number} precision - Significant figures
         * @returns {string} - Scientific notation string
         */
        scientific(value, precision = 2) {
            if (!isFinite(value)) return 'N/A';
            if (value === 0) return '0';
            
            const exponent = Math.floor(Math.log10(Math.abs(value)));
            const mantissa = value / Math.pow(10, exponent);
            
            return `${mantissa.toFixed(precision)} × 10^${exponent}`;
        }
    };

    /**
     * Statistical analysis utilities
     */
    static stats = {
        
        /**
         * Calculate basic statistics for an array of values
         * 
         * @param {Array<number>} values - Array of numeric values
         * @returns {Object} - Statistics object
         */
        descriptive(values) {
            if (!Array.isArray(values) || values.length === 0) {
                return { mean: 0, std: 0, min: 0, max: 0, median: 0, count: 0 };
            }
            
            const sorted = [...values].sort((a, b) => a - b);
            const sum = values.reduce((acc, val) => acc + val, 0);
            const mean = sum / values.length;
            
            const variance = values.reduce((acc, val) => 
                acc + Math.pow(val - mean, 2), 0) / values.length;
            const std = Math.sqrt(variance);
            
            return {
                count: values.length,
                mean: mean,
                std: std,
                min: sorted[0],
                max: sorted[sorted.length - 1],
                median: sorted[Math.floor(sorted.length / 2)],
                q25: sorted[Math.floor(sorted.length * 0.25)],
                q75: sorted[Math.floor(sorted.length * 0.75)]
            };
        },

        /**
         * Calculate correlation coefficient between two variables
         * 
         * @param {Array<number>} x - First variable
         * @param {Array<number>} y - Second variable
         * @returns {number} - Pearson correlation coefficient
         */
        correlation(x, y) {
            if (x.length !== y.length || x.length === 0) return 0;
            
            const n = x.length;
            const meanX = x.reduce((sum, val) => sum + val, 0) / n;
            const meanY = y.reduce((sum, val) => sum + val, 0) / n;
            
            let numerator = 0;
            let denomX = 0;
            let denomY = 0;
            
            for (let i = 0; i < n; i++) {
                const deltaX = x[i] - meanX;
                const deltaY = y[i] - meanY;
                numerator += deltaX * deltaY;
                denomX += deltaX * deltaX;
                denomY += deltaY * deltaY;
            }
            
            const denominator = Math.sqrt(denomX * denomY);
            return denominator === 0 ? 0 : numerator / denominator;
        },

        /**
         * Perform linear regression analysis
         * 
         * @param {Array<number>} x - Independent variable
         * @param {Array<number>} y - Dependent variable
         * @returns {Object} - Regression results
         */
        linearRegression(x, y) {
            if (x.length !== y.length || x.length < 2) {
                return { slope: 0, intercept: 0, r2: 0 };
            }
            
            const n = x.length;
            const sumX = x.reduce((sum, val) => sum + val, 0);
            const sumY = y.reduce((sum, val) => sum + val, 0);
            const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
            const sumXX = x.reduce((sum, val) => sum + val * val, 0);
            const sumYY = y.reduce((sum, val) => sum + val * val, 0);
            
            const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
            const intercept = (sumY - slope * sumX) / n;
            
            // Calculate R²
            const meanY = sumY / n;
            const ssTotal = sumYY - n * meanY * meanY;
            const ssRes = y.reduce((sum, val, i) => {
                const predicted = slope * x[i] + intercept;
                return sum + Math.pow(val - predicted, 2);
            }, 0);
            const r2 = 1 - ssRes / ssTotal;
            
            return { slope, intercept, r2 };
        },

        /**
         * Calculate confidence intervals
         * 
         * @param {Array<number>} values - Sample values
         * @param {number} confidence - Confidence level (0-1)
         * @returns {Object} - Confidence interval
         */
        confidenceInterval(values, confidence = 0.95) {
            const stats = this.descriptive(values);
            const alpha = 1 - confidence;
            const tValue = this.tDistribution(stats.count - 1, alpha / 2);
            const marginOfError = tValue * stats.std / Math.sqrt(stats.count);
            
            return {
                lower: stats.mean - marginOfError,
                upper: stats.mean + marginOfError,
                margin: marginOfError
            };
        },

        /**
         * Approximate t-distribution critical value
         * 
         * @param {number} df - Degrees of freedom
         * @param {number} alpha - Significance level
         * @returns {number} - t-statistic
         */
        tDistribution(df, alpha) {
            // Simplified approximation for common cases
            if (df >= 30) return this.normalInverse(1 - alpha);
            
            const tTable = {
                1: { 0.05: 6.314, 0.025: 12.706, 0.005: 63.657 },
                2: { 0.05: 2.920, 0.025: 4.303, 0.005: 9.925 },
                3: { 0.05: 2.353, 0.025: 3.182, 0.005: 5.841 },
                4: { 0.05: 2.132, 0.025: 2.776, 0.005: 4.604 },
                5: { 0.05: 2.015, 0.025: 2.571, 0.005: 4.032 }
            };
            
            const closestDf = Math.min(df, 5);
            const closestAlpha = alpha <= 0.005 ? 0.005 : 
                               alpha <= 0.025 ? 0.025 : 0.05;
            
            return tTable[closestDf]?.[closestAlpha] || 2.0;
        },

        /**
         * Approximate normal distribution inverse (for z-scores)
         * 
         * @param {number} p - Cumulative probability
         * @returns {number} - Z-score
         */
        normalInverse(p) {
            // Beasley-Springer-Moro approximation
            const a = [0, -3.969683028665376e+01, 2.209460984245205e+02,
                      -2.759285104469687e+02, 1.383577518672690e+02,
                      -3.066479806614716e+01, 2.506628277459239e+00];
            
            const b = [0, -5.447609879822406e+01, 1.615858368580409e+02,
                      -1.556989798598866e+02, 6.680131188771972e+01,
                      -1.328068155288572e+01];
            
            if (p <= 0 || p >= 1) return 0;
            
            const q = p < 0.5 ? p : 1 - p;
            const t = Math.sqrt(-2 * Math.log(q));
            
            let numerator = a[6];
            let denominator = b[5];
            
            for (let i = 5; i >= 1; i--) {
                numerator = numerator * t + a[i];
                denominator = denominator * t + b[i-1];
            }
            
            const result = t - numerator / denominator;
            return p < 0.5 ? -result : result;
        }
    };

    /**
     * Performance monitoring utilities
     */
    static performance = {
        
        /**
         * Simple performance timer
         */
        timer: {
            _timers: new Map(),
            
            start(name) {
                this._timers.set(name, performance.now());
            },
            
            end(name) {
                const start = this._timers.get(name);
                if (start === undefined) return 0;
                this._timers.delete(name);
                return performance.now() - start;
            },
            
            measure(name, fn) {
                this.start(name);
                const result = fn();
                const duration = this.end(name);
                return { result, duration };
            }
        },

        /**
         * Memory usage estimation
         * 
         * @param {any} obj - Object to estimate memory usage for
         * @returns {number} - Estimated bytes
         */
        estimateMemoryUsage(obj) {
            const seen = new WeakSet();
            
            function sizeOf(object) {
                if (object === null || typeof object !== 'object') {
                    if (typeof object === 'string') return object.length * 2;
                    if (typeof object === 'number') return 8;
                    if (typeof object === 'boolean') return 4;
                    return 0;
                }
                
                if (seen.has(object)) return 0;
                seen.add(object);
                
                let bytes = 0;
                
                if (Array.isArray(object)) {
                    bytes += object.length * 8; // Array overhead
                    for (const item of object) {
                        bytes += sizeOf(item);
                    }
                } else {
                    bytes += Object.keys(object).length * 8; // Object overhead
                    for (const [key, value] of Object.entries(object)) {
                        bytes += key.length * 2; // Key string
                        bytes += sizeOf(value);
                    }
                }
                
                return bytes;
            }
            
            return sizeOf(obj);
        },

        /**
         * Debounce function calls
         * 
         * @param {Function} func - Function to debounce
         * @param {number} delay - Delay in milliseconds
         * @returns {Function} - Debounced function
         */
        debounce(func, delay) {
            let timeoutId;
            return function (...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(this, args), delay);
            };
        },

        /**
         * Throttle function calls
         * 
         * @param {Function} func - Function to throttle
         * @param {number} limit - Minimum time between calls (ms)
         * @returns {Function} - Throttled function
         */
        throttle(func, limit) {
            let inThrottle;
            return function (...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
    };

    /**
     * Color utilities for data visualization
     */
    static colors = {
        
        /**
         * Generate color palette for visualizations
         * 
         * @param {number} count - Number of colors needed
         * @param {string} scheme - Color scheme ('viridis', 'plasma', 'cool', 'warm')
         * @returns {Array<string>} - Array of hex color strings
         */
        generatePalette(count, scheme = 'viridis') {
            const schemes = {
                viridis: ['#440154', '#404387', '#2a788e', '#22a884', '#7ad151', '#fde725'],
                plasma: ['#0d0887', '#6a00a8', '#b12a90', '#e16462', '#fca636', '#f0f921'],
                cool: ['#6e40aa', '#5289c7', '#1ac7c2', '#52f667', '#c4ec74', '#ffe658'],
                warm: ['#7c1d6f', '#bb3754', '#dc5039', '#f2701d', '#f89b11', '#fcce25']
            };
            
            const baseColors = schemes[scheme] || schemes.viridis;
            const colors = [];
            
            for (let i = 0; i < count; i++) {
                const t = i / (count - 1);
                const colorIndex = t * (baseColors.length - 1);
                const lowerIndex = Math.floor(colorIndex);
                const upperIndex = Math.ceil(colorIndex);
                const ratio = colorIndex - lowerIndex;
                
                if (lowerIndex === upperIndex) {
                    colors.push(baseColors[lowerIndex]);
                } else {
                    const interpolated = this.interpolateColor(
                        baseColors[lowerIndex], 
                        baseColors[upperIndex], 
                        ratio
                    );
                    colors.push(interpolated);
                }
            }
            
            return colors;
        },

        /**
         * Interpolate between two hex colors
         * 
         * @param {string} color1 - First color (hex)
         * @param {string} color2 - Second color (hex)
         * @param {number} ratio - Interpolation ratio (0-1)
         * @returns {string} - Interpolated color (hex)
         */
        interpolateColor(color1, color2, ratio) {
            const hex1 = color1.replace('#', '');
            const hex2 = color2.replace('#', '');
            
            const r1 = parseInt(hex1.substr(0, 2), 16);
            const g1 = parseInt(hex1.substr(2, 2), 16);
            const b1 = parseInt(hex1.substr(4, 2), 16);
            
            const r2 = parseInt(hex2.substr(0, 2), 16);
            const g2 = parseInt(hex2.substr(2, 2), 16);
            const b2 = parseInt(hex2.substr(4, 2), 16);
            
            const r = Math.round(r1 + (r2 - r1) * ratio);
            const g = Math.round(g1 + (g2 - g1) * ratio);
            const b = Math.round(b1 + (b2 - b1) * ratio);
            
            return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        }
    };

    /**
     * Event handling utilities
     */
    static events = {
        
        /**
         * Create custom event dispatcher
         * 
         * @returns {Object} - Event dispatcher object
         */
        createDispatcher() {
            const listeners = new Map();
            
            return {
                on(event, callback) {
                    if (!listeners.has(event)) {
                        listeners.set(event, []);
                    }
                    listeners.get(event).push(callback);
                },
                
                off(event, callback) {
                    const eventListeners = listeners.get(event);
                    if (eventListeners) {
                        const index = eventListeners.indexOf(callback);
                        if (index > -1) {
                            eventListeners.splice(index, 1);
                        }
                    }
                },
                
                emit(event, data) {
                    const eventListeners = listeners.get(event);
                    if (eventListeners) {
                        eventListeners.forEach(callback => callback(data));
                    }
                },
                
                once(event, callback) {
                    const onceCallback = (data) => {
                        callback(data);
                        this.off(event, onceCallback);
                    };
                    this.on(event, onceCallback);
                }
            };
        }
    };
}

// Export utilities for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RetrocausalUtils;
} else if (typeof window !== 'undefined') {
    window.RetrocausalUtils = RetrocausalUtils;
}