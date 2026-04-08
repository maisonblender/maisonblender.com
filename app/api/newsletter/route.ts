import { NextResponse } from 'next/server';

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_LIST_ID = process.env.BREVO_LIST_ID || '2'; // Default list ID

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Geldig e-mailadres is verplicht' },
        { status: 400 }
      );
    }

    if (!BREVO_API_KEY) {
      console.error('BREVO_API_KEY not configured');
      return NextResponse.json(
        { error: 'Nieuwsbrief service niet geconfigureerd' },
        { status: 500 }
      );
    }

    // Add contact to Brevo list
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        listIds: [parseInt(BREVO_LIST_ID)],
        updateEnabled: true, // Update if contact already exists
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Brevo API error:', response.status, errorData);
      
      // Handle specific Brevo errors
      if (response.status === 400 && errorData?.code === 'duplicate_parameter') {
        return NextResponse.json(
          { message: 'Je bent al ingeschreven!' },
          { status: 200 }
        );
      }
      
      return NextResponse.json(
        { error: 'Inschrijving mislukt, probeer het later opnieuw' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Succesvol ingeschreven!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter API error:', error);
    return NextResponse.json(
      { error: 'Er ging iets mis, probeer het later opnieuw' },
      { status: 500 }
    );
  }
}
