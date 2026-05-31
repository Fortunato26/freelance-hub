/* eslint-disable @typescript-eslint/no-explicit-any */

const createMockMethod = () => async (_args?: any) => {
  if (_args?.include) return []
  if (_args?.data) return _args.data
  return null
}

const createModel = () => ({
  findMany: createMockMethod(),
  findUnique: createMockMethod(),
  findFirst: createMockMethod(),
  create: createMockMethod(),
  update: createMockMethod(),
  delete: createMockMethod(),
  count: async () => 0,
  aggregate: async () => ({ _sum: { amount: 0 } }),
})

export const prisma = {
  client: createModel(),
  project: createModel(),
  payment: createModel(),
  task: createModel(),
  user: createModel(),
} as any
