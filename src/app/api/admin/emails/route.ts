import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getUntypedClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const emailType = searchParams.get('type') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const supabase = getUntypedClient();

    // Build query with order info
    let query = supabase
      .from('email_logs')
      .select('*, orders!inner(order_id)', { count: 'exact' })
      .order('sent_at', { ascending: false, nullsFirst: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (emailType) {
      query = query.eq('email_type', emailType);
    }

    if (search) {
      query = query.or(`recipient_email.ilike.%${search}%,orders.order_id.ilike.%${search}%`);
    }

    query = query.range(offset, offset + limit - 1);

    const { data: emails, error, count } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Transform emails
    const transformedEmails = emails?.map((email) => ({
      id: email.id,
      order_id: email.order_id,
      order_display_id: email.orders?.order_id,
      email_type: email.email_type,
      recipient_email: email.recipient_email,
      subject: email.subject,
      status: email.status,
      error_message: email.error_message,
      sent_at: email.sent_at,
      created_at: email.created_at,
    }));

    return NextResponse.json({
      success: true,
      emails: transformedEmails,
      total: count || 0,
    });
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}
