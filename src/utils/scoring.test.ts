import { describe, it, expect } from 'vitest';
import { calculateSustainabilityScore, categoryScores, scoreLabel } from './scoring';
import type { CategoryEmissions } from '../types';

describe('scoring', () => {
  describe('categoryScores', () => {
    it('should award 100 for ideal or below emissions', () => {
      const idealEmissions: CategoryEmissions = {
        transport: 5,     // ideal: 10
        electricity: 30,  // ideal: 40
        food: 80,         // ideal: 85
        water: 1,         // ideal: 2
        waste: 2,         // ideal: 3
      };

      const scores = categoryScores(idealEmissions);

      expect(scores.transport).toBe(100);
      expect(scores.electricity).toBe(100);
      expect(scores.food).toBe(100);
      expect(scores.water).toBe(100);
      expect(scores.waste).toBe(100);
    });

    it('should award 0 for poor or above emissions', () => {
      const poorEmissions: CategoryEmissions = {
        transport: 300,     // poor: 250
        electricity: 350,  // poor: 300
        food: 250,         // poor: 220
        water: 20,         // poor: 15
        waste: 30,         // poor: 25
      };

      const scores = categoryScores(poorEmissions);

      expect(scores.transport).toBe(0);
      expect(scores.electricity).toBe(0);
      expect(scores.food).toBe(0);
      expect(scores.water).toBe(0);
      expect(scores.waste).toBe(0);
    });

    it('should linearly interpolate scores between ideal and poor boundaries', () => {
      // transport ideal: 10, poor: 250. Middle: 130 should get 50.
      const emissions: CategoryEmissions = {
        transport: 130,
        electricity: 40,
        food: 85,
        water: 2,
        waste: 3,
      };

      const scores = categoryScores(emissions);
      expect(scores.transport).toBe(50);
      expect(scores.electricity).toBe(100);
    });
  });

  describe('calculateSustainabilityScore', () => {
    it('should compute weighted aggregate score correctly', () => {
      // If transport gets 50, and other categories get 100
      // transport weight is 0.3.
      // weighted total: 50 * 0.3 + 100 * 0.25 + 100 * 0.2 + 100 * 0.15 + 100 * 0.1
      // 15 + 25 + 20 + 15 + 10 = 85
      const emissions: CategoryEmissions = {
        transport: 130,
        electricity: 40,
        food: 85,
        water: 2,
        waste: 3,
      };

      expect(calculateSustainabilityScore(emissions)).toBe(85);
    });
  });

  describe('scoreLabel', () => {
    it('should return Excellent for scores >= 80', () => {
      expect(scoreLabel(80).label).toBe('Excellent');
      expect(scoreLabel(95).label).toBe('Excellent');
      expect(scoreLabel(80).color).toBe('text-leaf-text');
    });

    it('should return Good for scores between 60 and 79', () => {
      expect(scoreLabel(60).label).toBe('Good');
      expect(scoreLabel(79).label).toBe('Good');
      expect(scoreLabel(60).color).toBe('text-aqua-text');
    });

    it('should return Fair for scores between 40 and 59', () => {
      expect(scoreLabel(40).label).toBe('Fair');
      expect(scoreLabel(59).label).toBe('Fair');
      expect(scoreLabel(40).color).toBe('text-amber-text');
    });

    it('should return Needs Work for scores < 40', () => {
      expect(scoreLabel(39).label).toBe('Needs Work');
      expect(scoreLabel(0).label).toBe('Needs Work');
      expect(scoreLabel(20).color).toBe('text-coral-text');
    });
  });
});
