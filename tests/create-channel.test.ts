import axios, { AxiosResponse } from 'axios';

const baseUrl: string = 'https://api-sb11.rpc.ziichat.dev';

let headers: { 'x-session-token': string };

const prefix = "create-channel-http-api-test";
beforeAll(async () => {
  const response = await axios.post(`${baseUrl}/InternalFaker/MockUsers`, {
    prefix: prefix,
    quantity: 1,
    badge: 0,
  });
  
  const token = response.data.data[0].token;
  headers = {
    'x-session-token': token,
  };
});

describe('Create Channel HTTP Api', () => {
  const createChannelUrl: string = `${baseUrl}/Channel/createChannel`;

  describe('Test Meta data', () => {
    it('should return status code 403 when missing header x-session-token', async () => {
      try {
        await axios.post(createChannelUrl, {
          workspaceId: null,
        });
      } catch (error) {
        const errorRes = (error as any).response as AxiosResponse;

        expect(errorRes.status).toBe(403);
        expect(errorRes.data).toEqual('Token not found');
      }
    });

    it('should return status code 403 when pass wrong header x-session-token', async () => {
      try {
        await axios.post(
          createChannelUrl,
          {
            workspaceId: null,
          },
          {
            headers: {
              'x-session-token': 'wrong-token',
            },
          }
        );
      } catch (error) {
        const errorRes = (error as any).response as AxiosResponse;

        expect(errorRes.status).toBe(403);
        expect(errorRes.data).toEqual('Invalid token');
      }
    });

    it('should return status code 403 when x-session-token is undefined', async () => {
      try {
        await axios.post(createChannelUrl, {
          workspaceId: '0',
          name: 'Test Channel',
        }, {
          headers: {
            'x-session-token': undefined,
          },
        });
      } catch (error) {
        const errorRes = (error as any).response as AxiosResponse;
        expect(errorRes.status).toBe(403);
        expect(errorRes.data).toEqual('Token not found');
      }
    });

    it('should return status code 500 when use method GET instead of POST', async () => {
      try {
        await axios.get(createChannelUrl, { headers });
      } catch (error) {
        const errorRes = (error as any).response as AxiosResponse;

        expect(errorRes.status).toBe(500);
        expect(errorRes.data.error.details).toEqual(['NotFoundException: Cannot GET /Channel/createChannel']);
      }
    });
  });

  describe('Test Requeset Params', () => {
    it('should return status code 400 when workspaceId is null or undefined', async () => {
      try {
        await axios.post(
          createChannelUrl,
          {
            workspaceId: null,
          },
          { headers }
        );
      } catch (error) {
        const errorRes = (error as any).response as AxiosResponse;

        expect(errorRes.status).toBe(400);
        expect(errorRes.data).toHaveProperty('error');
        expect(errorRes.data.error.details).toEqual([
          'workspaceId should not be null or undefined',
          'workspaceId must be equal to 0',
          'workspaceId must be a string',
          'workspaceId should not be empty',
          'name should not be null or undefined',
          'name must be shorter than or equal to 255 characters',
          'name must be longer than or equal to 3 characters',
          'name must be a string',
          'name should not be empty',
        ]);
      }
    });

    it('should return status code 400 workspaceId is not equal to 0', async () => {
      try {
        await axios.post(
          createChannelUrl,
          {
            workspaceId: 1,
          },
          { headers }
        );
      } catch (error) {
        const errorRes = (error as any).response as AxiosResponse;

        expect(errorRes.status).toBe(400);
        expect(errorRes.data).toHaveProperty('error');
        expect(errorRes.data.error.details).toEqual([
          'workspaceId must be equal to 0',
          'workspaceId must be a string',
          'name should not be null or undefined',
          'name must be shorter than or equal to 255 characters',
          'name must be longer than or equal to 3 characters',
          'name must be a string',
          'name should not be empty',
        ]);
      }
    });

    it('should return status code 400 workspaceId is not a string', async () => {
      try {
        await axios.post(
          createChannelUrl,
          {
            workspaceId: 1,
          },
          { headers }
        );
      } catch (error) {
        const errorRes = (error as any).response as AxiosResponse;

        expect(errorRes.status).toBe(400);
        expect(errorRes.data.error.details).toEqual([
          'workspaceId must be equal to 0',
          'workspaceId must be a string',
          'name should not be null or undefined',
          'name must be shorter than or equal to 255 characters',
          'name must be longer than or equal to 3 characters',
          'name must be a string',
          'name should not be empty',
        ]);
      }
    });

    it('should return status code 400 when name is null or undefined', async () => {
      try {
        await axios.post(
          createChannelUrl,
          {
            workspaceId: '0',
            name: null,
          },
          { headers }
        );
      } catch (error) {
        const errorRes = (error as any).response as AxiosResponse;

        expect(errorRes.status).toBe(400);
        expect(errorRes.data).toHaveProperty('error');
        expect(errorRes.data.error.details).toEqual([
          'name should not be null or undefined',
          'name must be shorter than or equal to 255 characters',
          'name must be longer than or equal to 3 characters',
          'name must be a string',
          'name should not be empty',
        ]);
      }
    });

    it('should return status code 400 when name is longer than 255 characters', async () => {
      try {
        await axios.post(
          createChannelUrl,
          {
            workspaceId: '0',
            name: 'a'.repeat(256),
          },
          { headers }
        );
      } catch (error) {
        const errorRes = (error as any).response as AxiosResponse;

        expect(errorRes.status).toBe(400);
        expect(errorRes.data).toHaveProperty('error');
        expect(errorRes.data.error.details).toEqual(['name must be shorter than or equal to 255 characters']);
      }
    });

    it('should return status code 400 when name is shorter than 3 characters', async () => {
      try {
        await axios.post(
          createChannelUrl,
          {
            workspaceId: '0',
            name: 'a',
          },
          { headers }
        );
      } catch (error) {
        const errorRes = (error as any).response as AxiosResponse;

        expect(errorRes.status).toBe(400);
        expect(errorRes.data).toHaveProperty('error');
        expect(errorRes.data.error.details).toEqual(['name must be longer than or equal to 3 characters']);
      }
    });

    it('should return status code 400 when name is a number', async () => {
      try {
        await axios.post(
          createChannelUrl,
          {
            workspaceId: '0',
            name: 1,
          },
          { headers }
        );
      } catch (error) {
        const errorRes = (error as any).response as AxiosResponse;

        expect(errorRes.status).toBe(500);
        expect(errorRes.data).toHaveProperty('error');
        expect(errorRes.data.error.details).toEqual(['TypeError: value.trim is not a function']);
      }
    });

    it('should return status code 400 when name is an empty string', async () => {
      try {
        await axios.post(createChannelUrl, {
          workspaceId: '0',
          name: '',
        }, { headers });
      } catch (error) {
        const errorRes = (error as any).response as AxiosResponse;
        expect(errorRes.status).toBe(400);
        expect(errorRes.data).toHaveProperty('error');
        expect(errorRes.data.error.details).toEqual([
          'name must be longer than or equal to 3 characters',
          'name should not be empty',
        ]);
      }
    });

    it('should return status code 400 when all required params are missing', async () => {
      try {
        await axios.post(createChannelUrl, {}, { headers });
      } catch (error) {
        const errorRes = (error as any).response as AxiosResponse;
        expect(errorRes.status).toBe(400);
        expect(errorRes.data).toHaveProperty('error');
        expect(errorRes.data.error.details).toEqual([
          'workspaceId should not be null or undefined',
          'workspaceId must be equal to 0',
          'workspaceId must be a string',
          'workspaceId should not be empty',
          'name should not be null or undefined',
          'name must be shorter than or equal to 255 characters',
          'name must be longer than or equal to 3 characters',
          'name must be a string',
          'name should not be empty',
        ]);
      }
    });
  });

  describe('Test Business logic', () => {
    it('should return status code 201 when create channel successfully', async () => {
      const res = await axios.post(
        createChannelUrl,
        {
          workspaceId: '0',
          name: 'Test Channel',
        },
        { headers }
      );

      expect(res.status).toBe(201);
      expect(res.data.ok).toBe(true);
      expect(res.data).toHaveProperty('includes');
      expect(res.data.data).toHaveProperty('channel');
      expect(res.data.data).toHaveProperty('channelMetadata');
    });
  });
});

afterAll(async () => {
  await axios.delete(`${baseUrl}/InternalFaker/DeleteMockedUsers?prefix=${prefix}`);
});