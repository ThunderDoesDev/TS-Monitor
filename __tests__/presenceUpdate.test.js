const presenceModulePath = '../Events/presence/presenceUpdate';

jest.mock('../Functions/logger', () => ({
  log: jest.fn(),
  error: jest.fn()
}));

const { log } = require('../Functions/logger');

const presenceUpdate = require(presenceModulePath);

describe('presenceUpdate event', () => {
  let client;
  let channel;

  beforeEach(() => {
    channel = { send: jest.fn(() => Promise.resolve()) };
    const guild = { channels: { cache: { find: jest.fn(() => channel) } } };
    client = {
      settings: {
        bot: { botID: '123', statusChannel: 'chan', mainGuild: 'guild1' }
      },
      users: { cache: { get: jest.fn(() => ({ username: 'Bot' })) } },
      guilds: { cache: { get: jest.fn(() => guild) } }
    };
    jest.clearAllMocks();
  });

  test('does nothing if userId does not match', () => {
    const oldP = { status: 'online', user: { username: 'Bot' } };
    const newP = { status: 'offline', userId: '999' };
    presenceUpdate.run(client, oldP, newP);
    expect(channel.send).not.toHaveBeenCalled();
    expect(log).not.toHaveBeenCalled();
  });

  test('sends message when monitored bot goes offline', async () => {
    const oldP = { status: 'online', user: { username: 'Bot' } };
    const newP = { status: 'offline', userId: '123' };
    await presenceUpdate.run(client, oldP, newP);
    expect(channel.send).toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith('STATUS', 'Bot Is Currently Offline.');
  });
});
