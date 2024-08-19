import Livepeer from '../models/livepeer';

describe('Livepeer', () => {
  let data: any[] = [];
  const apiKey = 'testApiKey';
  let newItem = { id: '', name: '' };
  let livepeer: Livepeer;

  beforeAll(() => {
    livepeer = new Livepeer({ apiKey });
  });

  afterAll(() => {
    livepeer = new Livepeer({ apiKey });
  });

  beforeEach(() => {
    data = [];
    newItem = { id: '1', name: 'Test Item' };
  });

  afterEach(() => {
    newItem = { id: '', name: '' };
  });

  test.only('should get all assets', async () => {
    const res = await livepeer.getAll();

    expect(res.length).toBeGreaterThan(0);
  });

  it('should fail with an error', async () => {
    expect.assertions(1);
    try {
      await livepeer.deleteById('2ksieoq;');
    } catch (err) {
      expect(err).toMatch('error');
    }
  });

  it('should read an item', async () => {
    // await livepeer.create(newItem);
    // const res = await livepeer.read(newItem.id);
    // expect(res).toEqual(newItem);
  });

  it('should update an item', () => {
    // const newItem = { id: 1, name: 'Test item' };
    // Livepeer.create(newItem);
    // const updatedItem = { id: 1, name: 'Updated Item' };
    // Livepeer.update(newItem.id, updatedItem);
    // const res = Livepeer.read(newItem.id);
    // expect(res).toEqual(updatedItem);
  });

  test('should delete an item', () => {
    // const newItem = { id: 1, name: 'Test Item' };
    // Livepeer.create(newItem);
    // Livepeer.delete(newItem.id);
    // const res = Livepeer.read(newItem.id);
    // expect(res).toBeNull();
  });
});
