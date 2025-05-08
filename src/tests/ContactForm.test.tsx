import { render, screen, fireEvent } from "@testing-library/react"
import { ContactForm } from "../components/ContactForm"
import { setupServer } from "msw/node"
import { rest } from "msw"
import { afterAll, afterEach, beforeAll, test, describe, expect, vi } from "vitest"

const server = setupServer(
    rest.post('/api/contact', (_req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ message: 'Success' }))
    })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("ContactForm", () => {
    test("shows validation errors when fields are empty", async () => {
        render(<ContactForm />)

        fireEvent.click(screen.getByRole("button", { name: /submit/i }))

        expect(await screen.findByText(/First name is required/i)).toBeInTheDocument()
        expect(await screen.findByText(/Last name is required/i)).toBeInTheDocument()
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument()
        expect(screen.getByText(/please select a query type/i)).toBeInTheDocument()
        expect(screen.getByText(/message cannot be empty/i)).toBeInTheDocument()
    })

    test("shows email format error", async () => {
        render(<ContactForm />)

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: "invalid-email" },
        })

        fireEvent.click(screen.getByRole("button", { name: /submit/i }))

        expect(await screen.findByText(/invalid email address/i)).toBeInTheDocument()
    })

    test('submits successfully with valid data', async () => {
        vi.spyOn(global, 'fetch').mockResolvedValueOnce({
            ok: true,
            json: async () => ({ message: 'Success' }),
        } as Response)

        render(<ContactForm />)

        fireEvent.change(screen.getByLabelText(/first name/i), {
            target: { value: 'junkai' },
        })
        fireEvent.change(screen.getByLabelText(/last name/i), {
            target: { value: 'phang' },
        })
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'jk@example.com' },
        })
        fireEvent.change(screen.getByLabelText(/message/i), {
            target: { value: 'This is a message.' },
        })
        fireEvent.click(screen.getByLabelText(/general/i))
        fireEvent.click(screen.getByLabelText(/consent/i))
        fireEvent.click(screen.getByRole('button', { name: /submit/i }))

        const alert = await screen.findByRole('alert')
        expect(alert).toBeInTheDocument()
        expect(alert.textContent?.toLowerCase()).toContain('thank you')
    })
})
