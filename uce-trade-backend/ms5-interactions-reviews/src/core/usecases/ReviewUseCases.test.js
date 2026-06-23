// src/core/usecases/ReviewUseCases.test.js
const ReviewUseCases = require('./ReviewUseCases');

describe('ReviewUseCases', () => {
  let mockRepository;
  let useCases;

  beforeEach(() => {
    // Simulate the repository (Mock)
    mockRepository = {
      save: jest.fn().mockResolvedValue(true),
      findByVentureId: jest.fn().mockResolvedValue([])
    };
    useCases = new ReviewUseCases(mockRepository);
  });

  test('I should be able to successfully create a valid review', async () => {
    const validData = {
      ventureId: '123-abc',
      userId: 'user-456',
      rating: 5,
      comment: '¡Excelente servicio!'
    };

    const result = await useCases.createReview(validData);
    
    expect(result).toHaveProperty('id');
    expect(result.rating).toBe(5);
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
  });

  test('I should be able to successfully create a valid review', async () => {
    const validData = {
      ventureId: '123-abc',
      userId: 'user-456',
      rating: 5,
      comment: '¡Excelente servicio!'
    };

    const result = await useCases.createReview(validData);
    
    expect(result).toHaveProperty('id');
    expect(result.rating).toBe(5);
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
  });

  test('I should be able to successfully create a valid review', async () => {
    const invalidData = {
      ventureId: '123-abc',
      userId: 'user-456',
      rating: 4,
      comment: ''
    };

    await expect(useCases.createReview(invalidData)).rejects.toThrow('Comment cannot be empty');
  });
});