import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { firstName, lastName, email, subject, message, type } = await request.json();

        const name = `${firstName || ''} ${lastName || ''}`.trim();
        const supportEmail = process.env.SUPPORT_EMAIL || 'ayezafatima955@gmail.com';

        const { data, error } = await resend.emails.send({
            from: 'The Indian Attic <onboarding@resend.dev>',
            to: [supportEmail],
            subject: `[${type || 'Contact Form'}] ${subject || 'New Inquiry'}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; rounded: 8px;">
                    <h2 style="color: #1a1a1a; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">New Message from ${type || 'Website'}</h2>
                    <p><strong>Name:</strong> ${name || 'Not provided'}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject || 'Not provided'}</p>
                    <div style="margin-top: 20px; padding: 15px; bg-color: #f9f9f9; border-left: 4px solid #D4AF37;">
                        <p style="margin: 0;"><strong>Message:</strong></p>
                        <p style="white-space: pre-wrap; margin-top: 10px;">${message}</p>
                    </div>
                </div>
            `,
        });

        if (error) {
            return NextResponse.json({ error }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
