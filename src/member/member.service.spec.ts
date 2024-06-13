// import { Test, TestingModule } from '@nestjs/testing';
// import { MemberService } from './member.service';
// import { PrismaService } from 'src/prisma/prisma/prisma.service';

// describe('MemberService', () => {
//   let service: MemberService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [MemberService, PrismaService],
//     }).compile();

//     service = module.get<MemberService>(MemberService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });

import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { MemberService } from './member.service';
import CreateMemberDto from './dto/create-member.dto';

describe('MemberService', () => {
  let service: MemberService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberService,
        {
          provide: PrismaService,
          useValue: {
            member: {
              count: jest.fn(),
              create: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<MemberService>(MemberService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('generateMemberCode should generate correct member code', async () => {
    (prismaService.member.count as jest.Mock).mockResolvedValue(2); // Example mock count value

    const memberCode = await service.generateMemberCode();
    expect(memberCode).toBe('M003'); // Adjust expectation based on mock value
  });

  it('create should create a new member', async () => {
    const createMemberDto: CreateMemberDto = { name: 'Test Member' };

    (prismaService.member.create as jest.Mock).mockResolvedValue(createMemberDto);

    const result = await service.create(createMemberDto);

    expect(result).toEqual(createMemberDto);
    expect(prismaService.member.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        name: 'Test Member',
        code: expect.any(String),
      }),
    });
  });

  it('findAll should return all members with borrow counts', async () => {
    const mockMembers = [
      { id: 1, name: 'Member 1', _count: { borrows: { count: 2 } } },
      { id: 2, name: 'Member 2', _count: { borrows: { count: 0 } } },
    ];

    (prismaService.member.findMany as jest.Mock).mockResolvedValue(mockMembers);

    const result = await service.findAll();

    expect(result).toEqual(mockMembers);
    expect(prismaService.member.findMany).toHaveBeenCalled();
  });
});

