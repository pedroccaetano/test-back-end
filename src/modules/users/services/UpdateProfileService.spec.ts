import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Pedro Caetano',
      email: 'pedroccaetano@teste.com',
      password: '1234',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Pedro Caldas',
      email: 'pedroccaldas@teste.com',
    });

    expect(updatedUser.name).toBe('Pedro Caldas');
  });

  it('should not be able to update the profile with non existing user', async () => {
    await expect(
      updateProfileService.execute({
        user_id: '1232',
        name: 'Pedro Caldas',
        email: 'pedroccaldas@teste.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'Pedro One',
      email: 'pedroone@teste.com',
      password: '1234',
    });

    const user = await fakeUsersRepository.create({
      name: 'Pedro Two',
      email: 'pedrotwo@teste.com',
      password: '1234',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Pedro Caldas',
        email: 'pedroone@teste.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Pedro Caetano',
      email: 'pedroccaetano@teste.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Pedro Caldas',
      email: 'pedroccaldas@teste.com',
      old_password: '123456',
      password: '654321',
    });

    expect(updatedUser.password).toBe('654321');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Pedro Caetano',
      email: 'pedroccaetano@teste.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Pedro Caldas',
        email: 'pedroccaldas@teste.com',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Pedro Caetano',
      email: 'pedroccaetano@teste.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Pedro Caldas',
        email: 'pedroccaldas@teste.com',
        old_password: '123451',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
