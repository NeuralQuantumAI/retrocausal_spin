/**
 * Interactive Visualization System for Retrocausal Communication Concepts
 * 
 * This module creates educational visualizations that help users understand
 * complex theoretical concepts through interactive graphics. The visualizations
 * bridge the gap between abstract mathematics and intuitive understanding.
 * 
 * Educational Philosophy:
 * - Make abstract concepts concrete through visual representation
 * - Provide step-by-step animations that reveal underlying processes
 * - Enable interactive exploration to deepen understanding
 * - Connect mathematical formalism to physical intuition
 * 
 * Author: Tommy Xaypanya, NeuralQuantum.ai
 */

class RetrocausalVisualizer {
    constructor() {
        // Canvas contexts for different visualization types
        this.canvases = {};
        this.contexts = {};
        
        // Animation state management
        this.animationStates = {
            hammingEncoding: { playing: false, frame: 0, speed: 1.0 },
            convergenceProcess: { playing: false, frame: 0, speed: 1.0 },
            spinEvolution: { playing: false, frame: 0, speed: 1.0 }
        };
        
        // Color schemes for different elements
        this.colors = {
            dataBit: '#4CAF50',        // Green for information bits
            parityBit: '#2196F3',      // Blue for parity bits  
            errorBit: '#F44336',       // Red for error bits
            correctedBit: '#FF9800',   // Orange for corrected bits
            spinUp: '#00BCD4',         // Cyan for spin up
            spinDown: '#E91E63',       // Pink for spin down
            mixedState: '#9C27B0',     // Purple for mixed states
            convergence: '#4CAF50',    // Green for converged states
            iteration: '#FFC107',      // Amber for iteration progress
            background: '#F5F5F5',     // Light gray background
            text: '#212121'            // Dark gray text
        };
        
        // Animation timing parameters
        this.timing = {
            hammingStep: 800,     // milliseconds per encoding step
            convergenceStep: 500, // milliseconds per iteration
            spinFlip: 300,        // milliseconds for spin state change
            fadeTime: 200         // milliseconds for fade effects
        };
    }

    /**
     * Initialize all visualization canvases and contexts
     * 
     * This function sets up the drawing surfaces for different types of
     * visualizations. Each canvas handles a specific aspect of the
     * retrocausal communication system.
     */
    initializeCanvases() {
        // Initialize convergence visualization canvas
        this.setupCanvas('convergence-canvas', 600, 300);
        
        // Initialize spin state visualization
        this.setupSpinVisualization();
        
        // Initialize error correction analysis charts  
        this.setupErrorAnalysisChart();
        
        // Set up responsive canvas sizing
        window.addEventListener('resize', () => this.handleResize());
    }

    /**
     * Set up individual canvas with proper scaling and context
     * 
     * @param {string} canvasId - HTML canvas element ID
     * @param {number} width - Canvas width in pixels
     * @param {number} height - Canvas height in pixels
     */
    setupCanvas(canvasId, width, height) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        // Set up high-DPI support for crisp graphics
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        
        // Store references for later use
        this.canvases[canvasId] = canvas;
        this.contexts[canvasId] = ctx;
        
        // Set default drawing styles
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
    }

    /**
     * Visualize Hamming(7,4) encoding process step by step
     * 
     * This visualization helps users understand how information bits are
     * transformed into error-correcting codewords. Each step is animated
     * to show the mathematical relationships between bits.
     * 
     * @param {Array<number>} dataBits - 4-bit input data
     * @param {Array<number>} codeword - 7-bit encoded result
     * @param {boolean} animate - Whether to animate the process
     */
    visualizeHammingEncoding(dataBits, codeword, animate = true) {
        const container = document.getElementById('encoding-chain');
        if (!container) return;
        
        // Clear previous visualization
        container.innerHTML = '';
        
        // Create bit position containers
        const bitPositions = [
            { index: 0, type: 'parity', label: 'P1' },
            { index: 1, type: 'parity', label: 'P2' },
            { index: 2, type: 'data', label: 'D1' },
            { index: 3, type: 'parity', label: 'P3' },
            { index: 4, type: 'data', label: 'D2' },
            { index: 5, type: 'data', label: 'D3' },
            { index: 6, type: 'data', label: 'D4' }
        ];
        
        // Create visual representation of bit chain
        bitPositions.forEach((pos, i) => {
            const bitElement = this.createBitElement(pos, codeword[i]);
            container.appendChild(bitElement);
            
            if (animate) {
                // Animate appearance with delay based on position
                setTimeout(() => {
                    bitElement.classList.add('animated-bit');
                    this.highlightParityCalculation(pos, i, dataBits, codeword);
                }, i * 150);
            }
        });
        
        // Update explanation text
        this.updateEncodingExplanation(dataBits, codeword);
    }

    /**
     * Create visual element for a single bit in the encoding chain
     * 
     * @param {Object} position - Bit position information
     * @param {number} value - Bit value (0 or 1)
     * @returns {HTMLElement} - Styled bit element
     */
    createBitElement(position, value) {
        const element = document.createElement('div');
        element.className = `bit-element ${position.type}-bit`;
        
        // Create bit value display
        const valueDisplay = document.createElement('div');
        valueDisplay.className = 'bit-value';
        valueDisplay.textContent = value;
        
        // Create bit label
        const labelDisplay = document.createElement('div');
        labelDisplay.className = 'bit-label';
        labelDisplay.textContent = position.label;
        
        // Create position indicator
        const positionDisplay = document.createElement('div');
        positionDisplay.className = 'bit-position';
        positionDisplay.textContent = `Pos ${position.index + 1}`;
        
        element.appendChild(valueDisplay);
        element.appendChild(labelDisplay);
        element.appendChild(positionDisplay);
        
        return element;
    }

    /**
     * Highlight parity bit calculation relationships
     * 
     * This function shows users which data bits contribute to each
     * parity bit calculation, making the mathematical relationships visible.
     * 
     * @param {Object} position - Current bit position
     * @param {number} index - Bit index in codeword
     * @param {Array<number>} dataBits - Original data bits
     * @param {Array<number>} codeword - Encoded codeword
     */
    highlightParityCalculation(position, index, dataBits, codeword) {
        if (position.type !== 'parity') return;
        
        // Define which data bits contribute to each parity bit
        const parityRelations = {
            0: [2, 4, 6], // P1 uses positions 3, 5, 7 (0-indexed: 2, 4, 6)
            1: [2, 5, 6], // P2 uses positions 3, 6, 7 (0-indexed: 2, 5, 6)
            3: [4, 5, 6]  // P3 uses positions 5, 6, 7 (0-indexed: 4, 5, 6)
        };
        
        const relatedPositions = parityRelations[index];
        if (!relatedPositions) return;
        
        // Temporarily highlight related positions
        setTimeout(() => {
            relatedPositions.forEach(pos => {
                const element = document.querySelector(`.bit-element:nth-child(${pos + 1})`);
                if (element) {
                    element.classList.add('parity-related');
                    setTimeout(() => element.classList.remove('parity-related'), 1000);
                }
            });
        }, 200);
    }

    /**
     * Update the text explanation of the encoding process
     * 
     * @param {Array<number>} dataBits - Input data bits
     * @param {Array<number>} codeword - Encoded codeword
     */
    updateEncodingExplanation(dataBits, codeword) {
        const explanation = document.getElementById('encoding-explanation');
        if (!explanation) return;
        
        const dataString = dataBits.join('');
        const codeString = codeword.join(' ');
        
        explanation.innerHTML = `
            <div class="encoding-step">
                <strong>Input Data:</strong> ${dataString} (${parseInt(dataString, 2)} in decimal)
            </div>
            <div class="encoding-step">
                <strong>Encoded Codeword:</strong> ${codeString}
            </div>
            <div class="encoding-detail">
                <p><strong>Parity Calculations:</strong></p>
                <p>P1 = D1 ⊕ D2 ⊕ D4 = ${dataBits[0]} ⊕ ${dataBits[1]} ⊕ ${dataBits[3]} = ${codeword[0]}</p>
                <p>P2 = D1 ⊕ D3 ⊕ D4 = ${dataBits[0]} ⊕ ${dataBits[2]} ⊕ ${dataBits[3]} = ${codeword[1]}</p>
                <p>P3 = D2 ⊕ D3 ⊕ D4 = ${dataBits[1]} ⊕ ${dataBits[2]} ⊕ ${dataBits[3]} = ${codeword[3]}</p>
            </div>
        `;
    }

    /**
     * Visualize fixed-point iteration convergence process
     * 
     * This function creates a real-time graph showing how the algorithm
     * converges to a stable fixed-point solution. The visualization helps
     * users understand the mathematical behavior of the consistency enforcement.
     * 
     * @param {Array<Object>} convergenceHistory - History of iteration steps
     * @param {boolean} realTime - Whether to update in real-time or show complete
     */
    visualizeFixedPointConvergence(convergenceHistory, realTime = false) {
        const canvas = this.canvases['convergence-canvas'];
        const ctx = this.contexts['convergence-canvas'];
        if (!canvas || !ctx) return;
        
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
        
        if (convergenceHistory.length === 0) return;
        
        // Set up graph dimensions and margins
        const margin = { top: 20, right: 50, bottom: 40, left: 60 };
        const width = 600 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;
        
        // Find data ranges for scaling
        const maxIterations = convergenceHistory.length;
        const maxError = Math.max(...convergenceHistory.map(h => h.convergenceError));
        const minError = Math.min(...convergenceHistory.map(h => h.convergenceError));
        
        // Create scaling functions
        const xScale = (iteration) => margin.left + (iteration / maxIterations) * width;
        const yScale = (error) => {
            if (maxError === minError) return height / 2 + margin.top;
            return margin.top + height - ((error - minError) / (maxError - minError)) * height;
        };
        
        // Draw axes
        this.drawConvergenceAxes(ctx, margin, width, height, maxIterations, maxError);
        
        // Draw convergence curve
        this.drawConvergenceCurve(ctx, convergenceHistory, xScale, yScale);
        
        // Draw current iteration indicator if in real-time mode
        if (realTime && convergenceHistory.length > 0) {
            this.drawCurrentIterationIndicator(ctx, convergenceHistory, xScale, yScale);
        }
        
        // Update statistics display
        this.updateConvergenceStatistics(convergenceHistory);
    }

    /**
     * Draw axes for convergence graph
     */
    drawConvergenceAxes(ctx, margin, width, height, maxIterations, maxError) {
        ctx.strokeStyle = this.colors.text;
        ctx.lineWidth = 1;
        ctx.font = '12px Arial';
        
        // X-axis
        ctx.beginPath();
        ctx.moveTo(margin.left, margin.top + height);
        ctx.lineTo(margin.left + width, margin.top + height);
        ctx.stroke();
        
        // Y-axis
        ctx.beginPath();
        ctx.moveTo(margin.left, margin.top);
        ctx.lineTo(margin.left, margin.top + height);
        ctx.stroke();
        
        // X-axis labels
        ctx.textAlign = 'center';
        ctx.fillText('Iterations', margin.left + width/2, margin.top + height + 30);
        for (let i = 0; i <= 5; i++) {
            const x = margin.left + (i/5) * width;
            const iteration = Math.round((i/5) * maxIterations);
            ctx.fillText(iteration.toString(), x, margin.top + height + 15);
        }
        
        // Y-axis labels
        ctx.textAlign = 'right';
        ctx.save();
        ctx.translate(20, margin.top + height/2);
        ctx.rotate(-Math.PI/2);
        ctx.fillText('Convergence Error', 0, 0);
        ctx.restore();
        
        // Y-axis tick marks
        ctx.textAlign = 'right';
        for (let i = 0; i <= 4; i++) {
            const y = margin.top + height - (i/4) * height;
            const errorValue = (i/4) * maxError;
            ctx.fillText(errorValue.toFixed(3), margin.left - 10, y + 3);
        }
    }

    /**
     * Draw the convergence curve
     */
    drawConvergenceCurve(ctx, history, xScale, yScale) {
        if (history.length < 2) return;
        
        ctx.strokeStyle = this.colors.convergence;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        // Start from first point
        ctx.moveTo(xScale(0), yScale(history[0].convergenceError));
        
        // Draw curve through all points
        for (let i = 1; i < history.length; i++) {
            ctx.lineTo(xScale(i), yScale(history[i].convergenceError));
        }
        
        ctx.stroke();
        
        // Draw points
        ctx.fillStyle = this.colors.convergence;
        for (let i = 0; i < history.length; i++) {
            ctx.beginPath();
            ctx.arc(xScale(i), yScale(history[i].convergenceError), 3, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    /**
     * Draw indicator for current iteration
     */
    drawCurrentIterationIndicator(ctx, history, xScale, yScale) {
        const currentIndex = history.length - 1;
        const x = xScale(currentIndex);
        const y = yScale(history[currentIndex].convergenceError);
        
        // Pulsing circle animation
        const time = Date.now() / 500;
        const radius = 5 + 3 * Math.sin(time);
        
        ctx.strokeStyle = this.colors.iteration;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.stroke();
    }

    /**
     * Update convergence statistics display
     */
    updateConvergenceStatistics(history) {
        const currentIteration = document.getElementById('current-iteration');
        const convergenceError = document.getElementById('convergence-error');
        const convergenceStatus = document.getElementById('convergence-status');
        
        if (history.length === 0) return;
        
        const latest = history[history.length - 1];
        
        if (currentIteration) {
            currentIteration.textContent = latest.iteration;
        }
        
        if (convergenceError) {
            convergenceError.textContent = latest.convergenceError.toExponential(3);
        }
        
        if (convergenceStatus) {
            const status = latest.convergenceError < 1e-6 ? 'Converged' : 'Iterating';
            convergenceStatus.textContent = status;
            convergenceStatus.className = status.toLowerCase();
        }
    }

    /**
     * Visualize quantum spin state evolution
     * 
     * This function shows how quantum spin orientations evolve through
     * the retrocausal transmission process. The visual representation
     * helps users connect the abstract mathematics to physical intuition.
     * 
     * @param {Array<number>} initialState - Initial 7-bit state
     * @param {Array<number>} finalState - Final state after evolution
     * @param {Object} evolutionDetails - Details of evolution process
     */
    visualizeSpinEvolution(initialState, finalState, evolutionDetails) {
        const container = document.getElementById('spin-visualization');
        if (!container) return;
        
        // Create spin chain visualization
        const spinChain = container.querySelector('.spin-chain');
        if (spinChain) {
            spinChain.innerHTML = '';
            
            // Show initial state
            this.createSpinStateDisplay(spinChain, initialState, 'Initial State', 'initial');
            
            // Show transmitted state (with errors)
            if (evolutionDetails.transmittedState) {
                this.createSpinStateDisplay(spinChain, evolutionDetails.transmittedState, 'After Transmission', 'transmitted');
            }
            
            // Show final corrected state
            this.createSpinStateDisplay(spinChain, finalState, 'After Correction', 'final');
        }
        
        // Highlight error correction if it occurred
        if (evolutionDetails.errorsCorrected) {
            this.highlightErrorCorrection(evolutionDetails.errorPosition);
        }
    }

    /**
     * Create display for a single spin state
     */
    createSpinStateDisplay(container, state, label, phase) {
        const stateContainer = document.createElement('div');
        stateContainer.className = `spin-state-display ${phase}`;
        
        const stateLabel = document.createElement('div');
        stateLabel.className = 'spin-state-label';
        stateLabel.textContent = label;
        stateContainer.appendChild(stateLabel);
        
        const spinsContainer = document.createElement('div');
        spinsContainer.className = 'spins-container';
        
        state.forEach((bit, index) => {
            const spinElement = document.createElement('div');
            spinElement.className = `spin-element ${bit === 0 ? 'spin-up' : 'spin-down'}`;
            spinElement.textContent = bit === 0 ? '↑' : '↓';
            spinElement.title = `Qubit ${index + 1}: ${bit === 0 ? 'Spin Up |0⟩' : 'Spin Down |1⟩'}`;
            spinsContainer.appendChild(spinElement);
        });
        
        stateContainer.appendChild(spinsContainer);
        container.appendChild(stateContainer);
    }

    /**
     * Highlight error correction in spin visualization
     */
    highlightErrorCorrection(errorPosition) {
        if (errorPosition === -1) return;
        
        // Find transmitted state display and highlight error position
        setTimeout(() => {
            const transmittedDisplay = document.querySelector('.spin-state-display.transmitted');
            if (transmittedDisplay) {
                const spinElement = transmittedDisplay.querySelectorAll('.spin-element')[errorPosition];
                if (spinElement) {
                    spinElement.classList.add('error-corrected');
                    setTimeout(() => spinElement.classList.remove('error-corrected'), 2000);
                }
            }
        }, 500);
    }

    /**
     * Set up spin visualization area
     */
    setupSpinVisualization() {
        const container = document.getElementById('spin-visualization');
        if (!container) return;
        
        // Ensure spin-chain container exists
        let spinChain = container.querySelector('.spin-chain');
        if (!spinChain) {
            spinChain = document.createElement('div');
            spinChain.className = 'spin-chain';
            container.appendChild(spinChain);
        }
    }

    /**
     * Create error correction effectiveness chart
     * 
     * This visualization shows how error correction performance varies
     * with different error rates, demonstrating the value of the Hamming code.
     * 
     * @param {Array<Object>} performanceData - Error rate vs. accuracy data
     */
    createErrorCorrectionChart(performanceData) {
        const canvas = document.getElementById('error-correction-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Chart dimensions
        const margin = { top: 20, right: 40, bottom: 40, left: 50 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;
        
        // Data scaling
        const maxErrorRate = Math.max(...performanceData.map(d => d.errorRate));
        const xScale = (errorRate) => margin.left + (errorRate / maxErrorRate) * chartWidth;
        const yScale = (accuracy) => margin.top + chartHeight - (accuracy * chartHeight);
        
        // Draw axes
        this.drawChartAxes(ctx, margin, chartWidth, chartHeight, 'Error Rate', 'Accuracy');
        
        // Draw corrected accuracy curve
        this.drawPerformanceCurve(ctx, performanceData, xScale, yScale, 'corrected', this.colors.dataBit);
        
        // Draw uncorrected accuracy curve
        this.drawPerformanceCurve(ctx, performanceData, xScale, yScale, 'uncorrected', this.colors.errorBit);
        
        // Draw legend
        this.drawChartLegend(ctx, width, height);
    }

    /**
     * Draw chart axes with labels
     */
    drawChartAxes(ctx, margin, width, height, xLabel, yLabel) {
        ctx.strokeStyle = this.colors.text;
        ctx.lineWidth = 1;
        ctx.font = '12px Arial';
        
        // X-axis
        ctx.beginPath();
        ctx.moveTo(margin.left, margin.top + height);
        ctx.lineTo(margin.left + width, margin.top + height);
        ctx.stroke();
        
        // Y-axis
        ctx.beginPath();
        ctx.moveTo(margin.left, margin.top);
        ctx.lineTo(margin.left, margin.top + height);
        ctx.stroke();
        
        // Labels
        ctx.textAlign = 'center';
        ctx.fillText(xLabel, margin.left + width/2, margin.top + height + 30);
        ctx.save();
        ctx.translate(15, margin.top + height/2);
        ctx.rotate(-Math.PI/2);
        ctx.fillText(yLabel, 0, 0);
        ctx.restore();
    }

    /**
     * Draw performance curve
     */
    drawPerformanceCurve(ctx, data, xScale, yScale, type, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        data.forEach((point, index) => {
            const x = xScale(point.errorRate);
            const y = yScale(point[type + 'Accuracy']);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
    }

    /**
     * Draw chart legend
     */
    drawChartLegend(ctx, width, height) {
        const legendY = 40;
        
        // Corrected line
        ctx.strokeStyle = this.colors.dataBit;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(width - 120, legendY);
        ctx.lineTo(width - 100, legendY);
        ctx.stroke();
        
        ctx.fillStyle = this.colors.text;
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('With Error Correction', width - 95, legendY + 4);
        
        // Uncorrected line
        ctx.strokeStyle = this.colors.errorBit;
        ctx.beginPath();
        ctx.moveTo(width - 120, legendY + 20);
        ctx.lineTo(width - 100, legendY + 20);
        ctx.stroke();
        
        ctx.fillText('Without Error Correction', width - 95, legendY + 24);
    }

    /**
     * Setup error analysis chart with initial data
     */
    setupErrorAnalysisChart() {
        // Generate initial performance data for demonstration
        const performanceData = [];
        for (let errorRate = 0; errorRate <= 0.25; errorRate += 0.05) {
            performanceData.push({
                errorRate: errorRate,
                correctedAccuracy: Math.max(0.9, 1 - errorRate * 0.5), // Simulated with correction
                uncorrectedAccuracy: Math.max(0.3, 1 - errorRate * 4)   // Simulated without correction
            });
        }
        
        this.createErrorCorrectionChart(performanceData);
    }

    /**
     * Handle window resize events
     */
    handleResize() {
        // Re-setup canvases with new dimensions if needed
        Object.keys(this.canvases).forEach(canvasId => {
            const canvas = this.canvases[canvasId];
            if (canvas) {
                // Could implement responsive sizing here
                console.log(`Handling resize for ${canvasId}`);
            }
        });
    }

    /**
     * Animation control methods
     */
    startAnimation(animationType) {
        if (this.animationStates[animationType]) {
            this.animationStates[animationType].playing = true;
        }
    }

    stopAnimation(animationType) {
        if (this.animationStates[animationType]) {
            this.animationStates[animationType].playing = false;
        }
    }

    /**
     * Get current visualization state for debugging
     */
    getVisualizationState() {
        return {
            canvases: Object.keys(this.canvases),
            animations: this.animationStates,
            colors: this.colors
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RetrocausalVisualizer;
} else if (typeof window !== 'undefined') {
    window.RetrocausalVisualizer = RetrocausalVisualizer;
}