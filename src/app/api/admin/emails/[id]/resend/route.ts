import { NextRequest, NextResponse } from 'next/server';
import { resendEmail } from '@/lib/email/send';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = await resendEmail(id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
    });
  } catch (error) {
    console.error('Error resending email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to resend email' },
      { status: 500 }
    );
  }
}
