import { ValidationError } from 'joi';
import supertest = require('supertest');

import { UserStore } from '../../models/User';
import { BadRequestError } from '../../errors';
import {
  getInvalidDetailsError,
  getInvalidIdError
} from '../../utils/get-errors';
import { truncateTable } from '../../utils/dbUtils';
import { AuthService } from '../../services/Auth';
import app from '../../server';
import { TEST_USER_PASSWORD, API_BASE_URL } from '../../utils/constants';

const req = supertest(app);
const { ADMIN_PASSWORD } = process.env;
const token = AuthService.generateToken(ADMIN_PASSWORD as string);

describe('User store', () => {
  it('should have an index method', () => {
    expect(UserStore.index).toBeDefined();
  });
  it('should have a show method', () => {
    expect(UserStore.show).toBeDefined();
  });
  it('should have a create method', () => {
    expect(UserStore.create).toBeDefined();
  });
});

describe('Userstore index method', () => {
  it('should be empty to start with', async () => {
    await truncateTable('users');
    expect(await UserStore.index()).toEqual([]);
  });

  it('should contain all created users', async () => {
    await truncateTable('users');
    const firstUser = await UserStore.create({
      firstName: 'Anthony',
      lastName: 'Joshua',
      password: TEST_USER_PASSWORD
    });

    const secondUser = await UserStore.create({
      firstName: 'Tyson',
      lastName: 'Fury',
      password: TEST_USER_PASSWORD
    });

    expect(await UserStore.index()).toEqual([
      {
        id: firstUser.id,
        firstName: firstUser.firstName,
        lastName: firstUser.lastName
      },
      {
        id: secondUser.id,
        firstName: secondUser.firstName,
        lastName: secondUser.lastName
      }
    ]);
  });
});

describe('Userstore show method', () => {
  it('should throw ValidationError if user id is invalid', async () => {
    const error = await getInvalidIdError(UserStore.show, '5');
    expect(error).toBeInstanceOf(ValidationError);
  });

  it('should return user given a correct id', async () => {
    const createdUser = await UserStore.create({
      firstName: 'Joe',
      lastName: 'Joyce',
      password: TEST_USER_PASSWORD
    });

    expect(await UserStore.show(createdUser.id)).toEqual({
      id: createdUser.id,
      firstName: createdUser.firstName,
      lastName: createdUser.lastName
    });
  });
});

describe('User store create method', () => {
  it('should create a user', async () => {
    const createdUser = await UserStore.create({
      firstName: 'War',
      lastName: 'Chisora',
      password: TEST_USER_PASSWORD
    });
  });

  it('should not return user password after creation', async () => {
    const createdUser = await UserStore.create({
      firstName: 'Chris',
      lastName: 'Brown',
      password: TEST_USER_PASSWORD
    });

    //@ts-ignore
    expect(createdUser.password).toBeUndefined();
  });
});

describe('User store first name check', () => {
  it('should should throw ValidationError if first name is not provided', async () => {
    //@ts-ignore
    const user = {
      firstName: undefined,
      lastName: 'Fury',
      password: TEST_USER_PASSWORD
    };

    //@ts-ignore
    const error = await getInvalidDetailsError(UserStore.create, user);
    expect(error).toBeInstanceOf(ValidationError);
  });

  it('should should throw ValidationError if first name less than one character', async () => {
    const user = {
      firstName: '',
      lastName: 'Smith',
      password: TEST_USER_PASSWORD
    };

    const error = await getInvalidDetailsError(UserStore.create, user);
    expect(error).toBeInstanceOf(ValidationError);
  });

  it('should should throw ValidationError if first name contains number', async () => {
    const user = {
      firstName: 'Example12',
      lastName: 'Smith',
      password: TEST_USER_PASSWORD
    };

    const error = await getInvalidDetailsError(UserStore.create, user);
    expect(error).toBeInstanceOf(ValidationError);
  });

  it('should should throw ValidationError if first name is contains any special character other than hypen', async () => {
    const user = {
      firstName: 'Joe@',
      lastName: 'Smith',
      password: TEST_USER_PASSWORD
    };

    const error = await getInvalidDetailsError(UserStore.create, user);
    expect(error).toBeInstanceOf(ValidationError);
  });

  it('should should NOT throw ValidationError if first name is contains hypen', async () => {
    const user = {
      firstName: 'compound-name',
      lastName: 'Logan',
      password: TEST_USER_PASSWORD
    };

    const error = await getInvalidDetailsError(UserStore.create, user);
    expect(error).toBeUndefined();
  });
});

describe('User store last name check', () => {
  it('should should throw ValidationError if last name is not provided', async () => {
    //@ts-ignore
    const user = {
      firstName: 'Tyson',
      lastName: undefined,
      password: TEST_USER_PASSWORD
    };

    //@ts-ignore
    const error = await getInvalidDetailsError(UserStore.create, user);
    expect(error).toBeInstanceOf(ValidationError);
  });

  it('should should throw ValidationError if last name less than one character', async () => {
    const user = {
      firstName: 'Tyson',
      lastName: '',
      password: '6587'
    };

    const error = await getInvalidDetailsError(UserStore.create, user);
    expect(error).toBeInstanceOf(ValidationError);
  });

  it('should should throw ValidationError if last name contains number', async () => {
    const user = {
      firstName: 'Tyson',
      lastName: 'example123',
      password: '7820'
    };

    const error = await getInvalidDetailsError(UserStore.create, user);
    expect(error).toBeInstanceOf(ValidationError);
  });

  it('should should throw ValidationError if last name is contains any special character other than hypen', async () => {
    const user = {
      firstName: 'Logan',
      lastName: 'Fury@',
      password: '8723'
    };

    const error = await getInvalidDetailsError(UserStore.create, user);
    expect(error).toBeInstanceOf(ValidationError);
  });

  it('should should NOT throw ValidationError if last name contains hypen', async () => {
    const user = {
      lastName: 'Tyson',
      firstName: 'compound-name',
      password: TEST_USER_PASSWORD
    };

    const error = await getInvalidDetailsError(UserStore.create, user);
    expect(error).toBeUndefined();
  });
});

describe('User store password check', () => {
  //@ts-ignore
  const user = {
    firstName: 'Tyson',
    lastName: 'Fury',
    password: ''
  };

  it('should should throw ValidationError if password is not provided', async () => {
    //@ts-ignore
    const user = {
      firstName: 'Tyson',
      lastName: 'Fury',
      password: undefined
    };
    //@ts-ignore
    const error = await getInvalidDetailsError(UserStore.create, user);
    expect(error).toBeInstanceOf(ValidationError);
  });

  it('should should throw ValidationError if password is less than 8 characters long', async () => {
    user.password = 'gh@';
    const error = await getInvalidDetailsError(UserStore.create, user);
    expect(error).toBeInstanceOf(ValidationError);
  });

  it('should should throw ValidationError if password contains no number', async () => {
    user.password = 'Qjuwhsmk@uy';
    const error = await getInvalidDetailsError(UserStore.create, user);
    expect(error).toBeInstanceOf(ValidationError);
  });

  it('should should throw ValidationError if password contains no special character', async () => {
    user.password = 'juwhsmkQ';
    const error = await getInvalidDetailsError(UserStore.create, user);
    expect(error).toBeInstanceOf(ValidationError);
  });

  it('should should throw ValidationError if password contains no upper case character', async () => {
    user.password = 'juwhsmk#';
    const error = await getInvalidDetailsError(UserStore.create, user);
    expect(error).toBeInstanceOf(ValidationError);
  });

  it('should should throw ValidationError if password contains no lower case character', async () => {
    user.password = 'YAHSKHHWIOK@#';
    const error = await getInvalidDetailsError(UserStore.create, user);
    expect(error).toBeInstanceOf(ValidationError);
  });
});

describe('users route should send status code', () => {
  it('200 if all products route is accessed', async () => {
    const res = await req
      .get(`${API_BASE_URL}/users`)
      .set({ authorization: `Bearer ${token}` });
    expect(res.statusCode).toBe(200);
  });

  it('200 if single user route is accessed', async () => {
    const user = await UserStore.create({
      firstName: 'Tyson',
      lastName: 'Fury',
      password: TEST_USER_PASSWORD
    });
    const res = await req
      .get(`${API_BASE_URL}/users/${user.id}`)
      .set({ authorization: `Bearer ${token}` });
    expect(res.statusCode).toBe(200);
  });
});
