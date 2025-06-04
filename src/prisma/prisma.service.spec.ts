import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(() => {
    service = new PrismaService();

    service.$connect = jest.fn();
    service.$disconnect = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should connect to the database on module init', async () => {
    await service.onModuleInit();
    expect(service.$connect).toHaveBeenCalled();
  });

  it('should disconnect from the database on module destroy', async () => {
    await service.onModuleDestroy();
    expect(service.$disconnect).toHaveBeenCalled();
  });

  it('should exit process on database connection error', async () => {
    const mockError = new Error('Connection error');
    (service.$connect as jest.Mock).mockRejectedValueOnce(mockError);

    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('Process exited');
    });

    await expect(service.onModuleInit()).rejects.toThrow('Process exited');
    expect(errorSpy).toHaveBeenCalledWith('Database connection failed', mockError);
    expect(exitSpy).toHaveBeenCalledWith(1);

    errorSpy.mockRestore();
    exitSpy.mockRestore();
  });
});
