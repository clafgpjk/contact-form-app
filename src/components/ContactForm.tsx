import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"

const FormSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    message: z.string().min(1, "Message cannot be empty"),
    queryType: z.enum(["general", "support"], {
        errorMap: () => ({ message: "Please select a query type" }),
    }),
    consent: z.literal(true, {
        errorMap: () => ({ message: "Please consent to being contacted" }),
    }),
})

type FormValues = z.infer<typeof FormSchema>

export const ContactForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<FormValues>({
        resolver: zodResolver(FormSchema),
    })

    const [submitted, setSubmitted] = useState(false)

    const onSubmit = async (data: FormValues) => {
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
            if (res.ok) {
                setSubmitted(true)
                reset()
            }
        } catch (err) {
            console.error("Submission error:", err)
        }
    }


    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-md space-y-6"
            noValidate
        >
            <h1 className="text-3xl font-semibold text-gray-900">Contact Us</h1>

            {/* First & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name<span className="text-red-600">*</span>
                    </label>
                    <input
                        id="firstName"
                        {...register("firstName")}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.firstName ? "border-red-500 ring-red-200" : "border-gray-300 focus:ring-emerald-400"
                        }`}
                    />
                    {errors.firstName && (
                        <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name<span className="text-red-600">*</span>
                    </label>
                    <input
                        id="lastName"
                        {...register("lastName")}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.lastName ? "border-red-500 ring-red-200" : "border-gray-300 focus:ring-emerald-400"
                        }`}
                    />
                    {errors.lastName && (
                        <p className="text-red-600 text-sm mt-1">{errors.lastName.message}</p>
                    )}
                </div>
            </div>

            {/* Email */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address<span className="text-red-600">*</span>
                </label>
                <input
                    id="email"
                    type="email"
                    {...register("email")}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.email ? "border-red-500 ring-red-200" : "border-gray-300 focus:ring-emerald-400"
                    }`}
                />
                {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                )}
            </div>

            {/* Query Type */}
            <fieldset>
                <legend className="block text-sm font-medium text-gray-700 mb-1">
                    Query Type<span className="text-red-600">*</span>
                </legend>
                <div className="flex flex-col md:flex-row gap-4">
                    {[
                        { label: "General Enquiry", value: "general" },
                        { label: "Support Request", value: "support" },
                    ].map(({ label, value }) => (
                        <label
                            key={value}
                            className={`flex-1 p-3 border rounded-lg flex items-center justify-start gap-2 cursor-pointer text-sm font-medium transition focus-within:ring-2 ${
                                watch("queryType") === value
                                    ? "bg-emerald-50 border-emerald-600 ring-2 ring-emerald-200"
                                    : "border-gray-300 hover:border-emerald-400"
                            }`}
                        >
                            <input
                                type="radio"
                                value={value}
                                {...register("queryType")}
                                className="accent-emerald-600"
                            />
                            <span>{label}</span>
                        </label>
                    ))}
                </div>
                {errors.queryType && (
                    <p className="text-red-600 text-sm mt-1">{errors.queryType.message}</p>
                )}
            </fieldset>

            {/* Message */}
            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message<span className="text-red-600">*</span>
                </label>
                <textarea
                    id="message"
                    rows={5}
                    {...register("message")}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.message ? "border-red-500 ring-red-200" : "border-gray-300 focus:ring-emerald-400"
                    }`}
                />
                {errors.message && (
                    <p className="text-red-600 text-sm mt-1">{errors.message.message}</p>
                )}
            </div>

            {/* Consent */}
            <div className="flex items-start gap-2">
                <input
                    id="consent"
                    type="checkbox"
                    {...register("consent")}
                    className="mt-1 accent-emerald-600"
                />
                <label htmlFor="consent" className="text-sm text-gray-700 leading-snug">
                    I consent to being contacted by the team<span className="text-red-600">*</span>
                </label>
            </div>
            {errors.consent && (
                <p className="text-red-600 text-sm mt-1">{errors.consent.message}</p>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3 px-4 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
                Submit
            </button>

            {submitted && (
                <div
                    role="alert"
                    className="text-sm text-green-700 bg-green-100 border border-green-300 rounded-md p-3 text-center"
                >
                    thank you! Your message has been successfully sent.
                </div>
            )}
        </form>
    )
}
