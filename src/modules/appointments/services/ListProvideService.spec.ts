import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvideService from './ListProvideService';

let fakeUsersRepository: FakeUsersRepository;
let listProvide: ListProvideService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    listProvide = new ListProvideService(fakeUsersRepository);
  });

  it('should be able to list de providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'Pedro Caetano',
      email: 'pedroccaetano@teste.com',
      password: 'dados',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'Jessica',
      email: 'jessica@teste.com',
      password: 'dados',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'aline',
      email: 'aline@teste.com',
      password: 'dados',
    });

    const providers = await listProvide.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
