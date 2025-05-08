import { rest } from 'msw'

export const handlers = [
    rest.post('/api/contact', (_req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ message: 'Success' }))
    }),
]