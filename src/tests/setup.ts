import '@testing-library/jest-dom'

import { server } from '../mocks/server'

//something like @Before/Each and @After/Each annotations in Spring
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())