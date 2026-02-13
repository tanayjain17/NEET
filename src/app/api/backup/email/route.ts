import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { timestamp, backup, filename } = await request.json()
    
    // Send backup via email using a service like Resend or SendGrid
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: 'tiwariadarsh1804@gmail.com',
        subject: `💕 Weekly NEET Tracker Backup - ${new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
        html: `
          <h2>💕 Weekly Backup for  NEET Tracker</h2>
          <p>Your weekly backup has been created successfully!</p>
          <p><strong>Backup Time:</strong> ${new Date(timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          <p>Download the attached JSON file to restore your data if needed.</p>
          <p>Made with ❤️ for NEET journey!</p>
        `,
        attachments: [{
          filename,
          content: Buffer.from(backup).toString('base64')
        }]
      })
    })

    return NextResponse.json({
      success: emailResponse.ok,
      message: emailResponse.ok ? 'Backup emailed successfully' : 'Email failed'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to send backup email'
    }, { status: 500 })
  }
}